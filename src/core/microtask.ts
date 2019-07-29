export interface Microtask extends MutationCallback { }

export function microtask(task: Microtask) {
  if (
    typeof process !== "undefined" &&
    typeof process.nextTick === "function"
  ) {
    process.nextTick(task);
  } else {
    const observer = new MutationObserver(task);
    const element = document.createTextNode("");
    observer.observe(element, {
      characterData: true
    });
    element.data = "";
  }
}
