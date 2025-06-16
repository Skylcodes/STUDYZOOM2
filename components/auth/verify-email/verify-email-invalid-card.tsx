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

export type VerifyEmailInvalidCardProps = CardProps & {
  email: string;
};

export function VerifyEmailInvalidCard({
  email,
  ...other
}: VerifyEmailInvalidCardProps): React.JSX.Element {
  const [isResendingEmailVerification, setIsResendingEmailVerification] =
    React.useState<boolean>(false);
    
  const handleResendEmailVerification = async (): Promise<void> => {
    if (!email) {
      toast.error('No email address provided. Please try signing up again.');
      return;
    }
    
    setIsResendingEmailVerification(true);
    const result = await resendEmailConfirmation({ email });
    if (!result?.serverError && !result?.validationErrors) {
      toast.success('Verification email sent successfully');
    } else {
      toast.error("Couldn't send verification email. Please try signing up again.");
    }
    setIsResendingEmailVerification(false);
  };
  
  return (
    <Card {...other}>
      <CardHeader>
        <CardTitle>Invalid Verification Link</CardTitle>
        <CardDescription>
          The verification link you clicked is invalid or has been used already.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-center gap-4">
        {email ? (
          <>
            <p className="text-center text-sm text-muted-foreground">
              Would you like to request a new verification email for <strong>{email}</strong>?
            </p>
            <Button
              type="button"
              variant="default"
              className="w-full"
              disabled={isResendingEmailVerification}
              onClick={handleResendEmailVerification}
            >
              {isResendingEmailVerification ? 'Sending...' : 'Send New Verification Email'}
            </Button>
          </>
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground">
              Please return to the sign-up page to create an account or request a new verification email.
            </p>
            <Button
              type="button"
              variant="default"
              className="w-full"
              href="/auth/sign-up"
            >
              Go to Sign Up
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
