/* SystemJS module definition */

declare var require: NodeRequire;
declare var module: NodeModule;
interface NodeRequireFunction {
	(id: string): any;
}

interface NodeRequire extends NodeRequireFunction {
	resolve(id: string): string;
	cache: any;
	extensions: any;
	main: NodeModule | undefined;
}

interface NodeModule {
  id: string;
}
