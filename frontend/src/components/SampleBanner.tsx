type Props = {
  message: string;
};

export function SampleBanner({ message }: Props) {
  return (
    <div
      className="rounded-lg border border-amber-700/25 bg-amber-100/80 px-3 py-2 text-sm text-amber-950"
      role="status"
    >
      {message}
    </div>
  );
}
