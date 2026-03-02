import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

function createIcon(
  name: string,
  nodes: React.ReactNode,
  defaults?: Partial<IconProps>,
) {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
    { className, ...props },
    ref,
  ) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        {...defaults}
        {...props}
      >
        {nodes}
      </svg>
    );
  });

  Component.displayName = name;
  return Component;
}

export const ArrowLeft = createIcon("ArrowLeft", (
  <>
    <path d="M4 12h16" />
    <path d="M10 6l-6 6 6 6" />
  </>
));

export const ArrowRight = createIcon("ArrowRight", (
  <>
    <path d="M4 12h16" />
    <path d="M14 6l6 6-6 6" />
  </>
));

export const Award = createIcon("Award", (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M8.5 12 7 20l5-3 5 3-1.5-8" />
  </>
));

export const BarChart = createIcon("BarChart", (
  <>
    <path d="M4 20h16" />
    <path d="M7 20v-7" />
    <path d="M12 20V6" />
    <path d="M17 20v-11" />
  </>
));

export const BookOpen = createIcon("BookOpen", (
  <>
    <path d="M12 6c-2.8-2.1-6.2-2.1-9 0v12c2.8-2.1 6.2-2.1 9 0" />
    <path d="M12 6c2.8-2.1 6.2-2.1 9 0v12c-2.8-2.1-6.2-2.1-9 0" />
    <path d="M12 6v12" />
  </>
));

export const Calendar = createIcon("Calendar", (
  <>
    <rect x="3" y="5" width="18" height="16" />
    <path d="M3 10h18" />
    <path d="M8 3v4M16 3v4" />
  </>
));

export const Check = createIcon("Check", <path d="m4 12 5 5 11-11" />);

export const CheckCircle2 = createIcon("CheckCircle2", (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-5" />
  </>
));

export const ChevronDown = createIcon("ChevronDown", <path d="m6 9 6 6 6-6" />);
export const ChevronLeft = createIcon("ChevronLeft", <path d="m15 6-6 6 6 6" />);
export const ChevronRight = createIcon("ChevronRight", <path d="m9 6 6 6-6 6" />);
export const ChevronUp = createIcon("ChevronUp", <path d="m6 15 6-6 6 6" />);

export const Circle = createIcon("Circle", <circle cx="12" cy="12" r="9" />);

export const Clock = createIcon("Clock", (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </>
));

export const CreditCard = createIcon("CreditCard", (
  <>
    <rect x="3" y="6" width="18" height="12" />
    <path d="M3 10h18" />
    <path d="M7 15h4" />
  </>
));

export const DollarSign = createIcon("DollarSign", (
  <>
    <path d="M12 3v18" />
    <path d="M16.5 7.5C15.2 5.6 8 5.6 8 9c0 5 8 2 8 6 0 3.2-6.8 3.3-8.5 1.5" />
  </>
));

export const Dot = createIcon(
  "Dot",
  <circle cx="12" cy="12" r="2.75" fill="currentColor" stroke="none" />,
  { stroke: "none" },
);

export const Eye = createIcon("Eye", (
  <>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </>
));

export const EyeOff = createIcon("EyeOff", (
  <>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M4 4 20 20" />
  </>
));

export const Filter = createIcon("Filter", (
  <>
    <path d="M3 5h18l-7 8v6l-4-2v-4z" />
  </>
));

export const GripVertical = createIcon("GripVertical", (
  <>
    <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="18" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="18" r="1" fill="currentColor" stroke="none" />
  </>
));

export const Heart = createIcon("Heart", (
  <>
    <path d="M12 20 4 12c-2.5-2.5-2-6.5 1-8 2.2-1.1 4.9-.2 7 2.1 2.1-2.3 4.8-3.2 7-2.1 3 1.5 3.5 5.5 1 8Z" />
  </>
));

export const KeyRound = createIcon("KeyRound", (
  <>
    <circle cx="7.5" cy="12" r="3.5" />
    <path d="M11 12h9" />
    <path d="M17 12v3M20 12v2" />
  </>
));

export const LayoutDashboard = createIcon("LayoutDashboard", (
  <>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="5" />
    <rect x="13" y="10" width="8" height="11" />
    <rect x="3" y="13" width="8" height="8" />
  </>
));

export const Loader2 = createIcon("Loader2", (
  <>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </>
));

export const Lock = createIcon("Lock", (
  <>
    <rect x="4" y="10" width="16" height="11" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </>
));

export const LockIcon = Lock;

export const LogOut = createIcon("LogOut", (
  <>
    <path d="M14 4h6v16h-6" />
    <path d="M10 12h10" />
    <path d="m13 9-3 3 3 3" />
  </>
));

export const Mail = createIcon("Mail", (
  <>
    <rect x="3" y="5" width="18" height="14" />
    <path d="m4 7 8 6 8-6" />
  </>
));

export const Menu = createIcon("Menu", (
  <>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </>
));

export const Moon = createIcon("Moon", (
  <>
    <path d="M15 3a9 9 0 1 0 6 15.5A8 8 0 0 1 15 3Z" />
  </>
));

export const MoreHorizontal = createIcon("MoreHorizontal", (
  <>
    <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </>
));

export const Mountain = createIcon("Mountain", (
  <>
    <path d="M3 20h18L14 8l-3 5-2-3Z" />
  </>
));

export const PanelLeft = createIcon("PanelLeft", (
  <>
    <rect x="3" y="4" width="18" height="16" />
    <path d="M9 4v16" />
  </>
));

export const Pencil = createIcon("Pencil", (
  <>
    <path d="m4 20 4.5-1 10-10-3.5-3.5-10 10Z" />
    <path d="m13.5 5.5 3.5 3.5" />
  </>
));

export const PlayCircle = createIcon("PlayCircle", (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m10 8 6 4-6 4Z" />
  </>
));

export const Plus = createIcon("Plus", (
  <>
    <path d="M12 4v16" />
    <path d="M4 12h16" />
  </>
));

export const Quote = createIcon("Quote", (
  <>
    <path d="M6 16h5V9H6z" />
    <path d="M13 16h5V9h-5z" />
    <path d="M11 9c0-2 1.2-3.5 3-4M18 9c0-2 1.2-3.5 3-4" />
  </>
));

export const Search = createIcon("Search", (
  <>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.2-4.2" />
  </>
));

export const Settings = createIcon("Settings", (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
  </>
));

export const Shield = createIcon("Shield", (
  <>
    <path d="M12 3 4 6v6c0 4 3 7 8 9 5-2 8-5 8-9V6Z" />
  </>
));

export const ShoppingCart = createIcon("ShoppingCart", (
  <>
    <path d="M3 4h2l2 10h11l2-7H7" />
    <circle cx="10" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
  </>
));

export const SortAsc = createIcon("SortAsc", (
  <>
    <path d="M8 18V6" />
    <path d="m5 9 3-3 3 3" />
    <path d="M14 18h5M14 13h4M14 8h3" />
  </>
));

export const SortDesc = createIcon("SortDesc", (
  <>
    <path d="M8 6v12" />
    <path d="m5 15 3 3 3-3" />
    <path d="M14 6h3M14 11h4M14 16h5" />
  </>
));

export const Star = createIcon("Star", (
  <>
    <path d="m12 3 2.6 5.3L20 9l-4 3.9.9 5.6-4.9-2.5-4.9 2.5.9-5.6L4 9l5.4-.7Z" />
  </>
));

export const Sun = createIcon("Sun", (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
  </>
));

export const Target = createIcon("Target", (
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </>
));

export const Trash2 = createIcon("Trash2", (
  <>
    <path d="M4 7h16" />
    <path d="M8 7V4h8v3" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M10 11v6M14 11v6" />
  </>
));

export const Upload = createIcon("Upload", (
  <>
    <path d="M12 16V5" />
    <path d="m7 10 5-5 5 5" />
    <path d="M4 20h16" />
  </>
));

export const User = createIcon("User", (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.8-3.2 4.5-5 8-5s6.2 1.8 8 5" />
  </>
));

export const Users = createIcon("Users", (
  <>
    <circle cx="9" cy="8.5" r="3.5" />
    <circle cx="16.5" cy="10" r="2.5" />
    <path d="M3.5 20c1.3-2.8 3.4-4.3 5.5-4.3s4.2 1.5 5.5 4.3" />
    <path d="M13.5 19.5c.8-1.8 2.2-3 4-3.6" />
  </>
));

export const X = createIcon("X", (
  <>
    <path d="M5 5 19 19" />
    <path d="M19 5 5 19" />
  </>
));

export const XCircle = createIcon("XCircle", (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 8l8 8M16 8l-8 8" />
  </>
));
