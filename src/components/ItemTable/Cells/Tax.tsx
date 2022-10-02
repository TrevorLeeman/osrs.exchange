export const TaxCell = ({ tax }: { tax: number | null | undefined }) => {
  if (tax === 0) return <>Free</>;
  if (!tax) return null;
  return <>{tax?.toLocaleString()}</>;
};
