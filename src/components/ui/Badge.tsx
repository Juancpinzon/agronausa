interface BadgeProps {
  children: string | number;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-ui text-xs font-semibold text-accent">
      {children}
    </span>
  );
}
