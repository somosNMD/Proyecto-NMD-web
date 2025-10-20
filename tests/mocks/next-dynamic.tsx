import { ComponentType, createElement, useState } from "react";

type DynamicOptions<P> = {
  loading?: () => JSX.Element | null;
  ssr?: boolean;
};

export default function dynamic<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>,
  options?: DynamicOptions<P>
) {
  let LoadedComponent: ComponentType<P> | null = null;

  const loadComponent = async () => {
    if (!LoadedComponent) {
      const mod = await loader();
      LoadedComponent = "default" in mod ? mod.default : (mod as ComponentType<P>);
    }
    return LoadedComponent;
  };

  const DynamicComponent = (props: P) => {
    const [Component, setComponent] = useState<ComponentType<P> | null>(LoadedComponent);

    if (!Component && options?.loading) {
      void loadComponent().then(setComponent);
      return options.loading();
    }

    if (!Component) {
      void loadComponent().then(setComponent);
      return null;
    }

    return createElement(Component, props);
  };

  return DynamicComponent;
}
