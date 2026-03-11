"use client";

import { useEffect, useState } from "react";

type TypingRolesProps = {
  roles: string[];
};

export function TypingRoles({ roles }: TypingRolesProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const completedTyping = displayText === currentRole;
    const completedDeleting = displayText.length === 0;

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting && completedTyping) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && completedDeleting) {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
          return;
        }

        setDisplayText((current) =>
          isDeleting
            ? current.slice(0, -1)
            : currentRole.slice(0, current.length + 1),
        );
      },
      completedTyping ? 1800 : isDeleting ? 40 : 70,
    );

    return () => window.clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, roles]);

  return (
    <div className="flex min-h-8 items-center text-lg font-medium text-slate-200 sm:text-xl">
      <span>{displayText}</span>
      <span className="ml-1 h-6 w-px animate-pulse bg-sky-300/80" />
    </div>
  );
}
