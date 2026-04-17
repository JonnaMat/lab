declare module '*.svg?react' {
  import { ReactElement } from 'react';
  const content: ReactElement;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}
