import Link from "next/link";

export interface Props {
  href: string;
  title: string;
}

const NavLink = ({ href, title }: Props) => {
  return (
    <Link
      href={href}
      className="block py-2 text-black  text-[14px]  font-medium rounded md^:p-0">
      {title}
    </Link>
  );
};

export default NavLink;
