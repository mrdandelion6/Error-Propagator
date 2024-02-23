type HeadingProps = { title: string }
// define typescript Type

const Heading = ({ title }: HeadingProps) => {
  return <h1>{title}</h1>
} // functional componenet, returns a JSX element

export default Heading