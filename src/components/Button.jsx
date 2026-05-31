export default function Button({
  as: Component = 'a',
  className = '',
  variant = 'light',
  children,
  ...props
}) {
  return (
    <Component className={`btn btn-${variant} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
