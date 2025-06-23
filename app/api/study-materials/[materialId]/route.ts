import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';
import { validate as uuidValidate } from 'uuid';

import { prisma } from '@/lib/db/prisma';
import { verifyResourceOwnership } from '@/lib/security/security-audit';
import { auth } from '@/lib/auth';
import type { Params } from '@/types/request-params';

const paramsCache = createSearchParamsCache({
  materialId: parseAsString.withDefault('')
});

/**
 * GET handler for retrieving study materials
 * Includes security checks for resource ownership
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<Params> }
): Promise<Response> {
  // Get the material ID from the URL parameters
  const { materialId } = await paramsCache.parse(props.params);
  if (!materialId || !uuidValidate(materialId)) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse(undefined, {
      status: 401,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  // Find the study material
  // Using prisma as any until Prisma client is regenerated with the new models
  const [studyMaterial] = await prisma.$transaction(
    [
      (prisma as any).studyMaterial.findFirst({
        where: { id: materialId },
        select: {
          id: true,
          studySetId: true,
          data: true,
          contentType: true,
          fileName: true,
          hash: true
        }
      })
    ],
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted
    }
  );

  if (!studyMaterial || !studyMaterial.data) {
    return new NextResponse(undefined, {
      status: 404,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  // Verify that the user has access to this study material
  const ownershipVerified = await verifyResourceOwnership(
    session.user.id,
    'studySet',
    studyMaterial.studySetId,
    'view_study_material'
  );

  if (!ownershipVerified) {
    return new NextResponse(undefined, {
      status: 403,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  // Check if the requested version matches the current hash
  const { searchParams } = new URL(req.url);
  const version = searchParams.get('v');
  if (version && version !== studyMaterial.hash) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  // Set appropriate headers for the file download
  const headers = {
    'Cache-Control': 'public, max-age=86400, immutable',
    'Content-Type': studyMaterial.contentType || 'application/octet-stream',
    'Content-Length': studyMaterial.data.length.toString(),
    'Content-Disposition': `inline; filename="${encodeURIComponent(studyMaterial.fileName)}"`
  };

  // Return the file data
  return new NextResponse(studyMaterial.data, {
    status: 200,
    headers
  });
}
