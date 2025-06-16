'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { resendEmailConfirmation } from '@/actions/auth/resend-email-confirmation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps
} from '@/components/ui/card';

export type VerifyEmailExpiredCardProps = CardProps & {
  email: string;
};

export function VerifyEmailExpiredCard({
  email,
  ...other
}: VerifyEmailExpiredCardProps): React.JSX.Element {
  const [isResendingEmailVerification, setIsResendingEmailVerification] =
    React.useState<boolean>(false);
  const handleResendEmailVerification = async (): Promise<void> => {
    setIsResendingEmailVerification(true);
    const result = await resendEmailConfirmation({ email });
    if (!result?.serverError && !result?.validationErrors) {
      toast.success('Email verification resent');
    } else {
      toast.error("Couldn't resend verification");
    }
    setIsResendingEmailVerification(false);
  };
  return (
    <Card {...other}>
      <CardHeader>
        <CardTitle>Email Verification Expired</CardTitle>
        <CardDescription>
          Your email verification link has expired. For security reasons, verification links are only valid for a limited time.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-center gap-4">
        <p className="text-center text-sm text-muted-foreground">
          Click the button below to request a new verification email.
        </p>
        <Button
          type="button"
          variant="default"
          className="w-full"
          disabled={isResendingEmailVerification}
          onClick={handleResendEmailVerification}
        >
          {isResendingEmailVerification ? 'Sending...' : 'Resend Verification Email'}
        </Button>
      </CardFooter>
    </Card>
  );
}
