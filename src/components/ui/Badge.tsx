interface BadgeProps {
  children: string | number;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
      {children}
    </span>
  );
}
