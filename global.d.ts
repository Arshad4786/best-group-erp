// Allow importing plain CSS files (global and module) in TypeScript
// This prevents errors like: "Cannot find module or type declarations for side-effect import of './globals.css'".

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.module.css';
declare module '*.module.scss';
declare module '*.module.sass';
