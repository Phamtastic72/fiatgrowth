type ClassNames = (false | string | ClassNames)[];

const filter = (classes: false | string | ClassNames): string => {
  if (!classes) {
    return "";
  }

  if (typeof classes === "string") {
    return classes;
  }

  if (Array.isArray(classes)) {
    return classes.flatMap(filter).filter(Boolean).join(" ");
  }

  return "";
};

export default function classNames(...classes: ClassNames) {
  return filter(classes);
}
