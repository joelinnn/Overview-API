export default class Log {
  public static log = (args) => this.info(args);

  public static info = (args) => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      `[${new Date().toLocaleString()}] [INFO]`,
      typeof args === "string" ? args : args
    );
  };

  public static warn = (args) => {
    console.log(
      "\x1b[33m%s\x1b[0m",
      `[${new Date().toLocaleString()}] [INFO]`,
      typeof args === "string" ? args : args
    );
  };

  public static error = (args) => {
    console.log(
      "\x1b[31m",
      `[${new Date().toLocaleString()}] [INFO]`,
      typeof args === "string" ? args : args
    );
  };
}
