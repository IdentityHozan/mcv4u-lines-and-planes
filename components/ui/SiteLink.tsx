import type { ComponentPropsWithRef } from "react";

export type SiteLinkProps = Omit<ComponentPropsWithRef<"a">, "href"> & {
  href: string;
};

/** Ordinary browser navigation, including query strings, fragments and new tabs. */
export function SiteLink({ href, ...props }: SiteLinkProps) {
  return <a href={href} {...props} />;
}

export default SiteLink;
