import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "../components/ui/badge";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const PORT_STATE_META: Record<
  string,
  {
    label: string;
    variant: BadgeVariant;
  }
> = {
  LISTEN: {
    label: "In Use",
    variant: "success",
  },
  ESTABLISHED: {
    label: "Connected",
    variant: "info",
  },
  CLOSE_WAIT: {
    label: "Close Wait",
    variant: "warning",
  },
  CLOSED: {
    label: "Closed",
    variant: "danger",
  },
};

export function getPortStateMeta(state: string) {
  const normalizedState = state.trim().toUpperCase();
  const meta = PORT_STATE_META[normalizedState];

  if (meta) {
    return meta;
  }

  return {
    label: normalizedState.replaceAll("_", " "),
    variant: "outline" as const,
  };
}
