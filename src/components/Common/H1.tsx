type H1Props = {
  children?: React.ReactNode;
};

const H1 = ({ children }: H1Props) => {
  return <h1 className="text-3xl font-bold xs:text-4xl sm:text-5xl">{children}</h1>;
};

export default H1;
