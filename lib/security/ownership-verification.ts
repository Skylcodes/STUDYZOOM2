import { redirect } from 'next/navigation';
import { Session } from 'next-auth';

import { Routes } from '@/constants/routes';
import { prisma } from '@/lib/db/prisma';

/**
 * Verifies that the current user owns the specified document
 * Redirects to access denied page if verification fails
 * 
 * @param session Current user session
 * @param documentId ID of the document to verify ownership
 * @returns The document if ownership is verified
 */
export async function verifyDocumentOwnership(session: Session, documentId: string) {
  if (!session?.user?.id) {
    redirect(Routes.AccessDenied);
  }

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
      userId: session.user.id
    }
  });

  if (!document) {
    redirect(Routes.AccessDenied);
  }

  return document;
}

/**
 * Verifies that the current user owns the specified flashcard set
 * Redirects to access denied page if verification fails
 * 
 * @param session Current user session
 * @param flashcardSetId ID of the flashcard set to verify ownership
 * @returns The flashcard set if ownership is verified
 */
export async function verifyFlashcardSetOwnership(session: Session, flashcardSetId: string) {
  if (!session?.user?.id) {
    redirect(Routes.AccessDenied);
  }

  const flashcardSet = await prisma.flashcardSet.findFirst({
    where: {
      id: flashcardSetId,
      document: {
        userId: session.user.id
      }
    },
    include: {
      document: true
    }
  });

  if (!flashcardSet) {
    redirect(Routes.AccessDenied);
  }

  return flashcardSet;
}

/**
 * Verifies that the current user owns the specified quiz
 * Redirects to access denied page if verification fails
 * 
 * @param session Current user session
 * @param quizId ID of the quiz to verify ownership
 * @returns The quiz if ownership is verified
 */
export async function verifyQuizOwnership(session: Session, quizId: string) {
  if (!session?.user?.id) {
    redirect(Routes.AccessDenied);
  }

  const quiz = await prisma.quiz.findFirst({
    where: {
      id: quizId,
      document: {
        userId: session.user.id
      }
    },
    include: {
      document: true
    }
  });

  if (!quiz) {
    redirect(Routes.AccessDenied);
  }

  return quiz;
}

/**
 * Verifies that the current user is a member of the specified study group
 * Redirects to access denied page if verification fails
 * 
 * @param session Current user session
 * @param studyGroupId ID of the study group to verify membership
 * @returns The study group if membership is verified
 */
export async function verifyStudyGroupMembership(session: Session, studyGroupId: string) {
  if (!session?.user?.id) {
    redirect(Routes.AccessDenied);
  }

  const membership = await prisma.studyGroupMember.findFirst({
    where: {
      studyGroupId,
      userId: session.user.id
    },
    include: {
      studyGroup: true
    }
  });

  if (!membership) {
    redirect(Routes.AccessDenied);
  }

  return membership.studyGroup;
}
