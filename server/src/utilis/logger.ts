import pino from "pino";

export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },
});


// import pino from "pino";

// export const logger = pino({
//   level: process.env.NODE_ENV === "production" ? "info" : "debug",
//   transport: process.env.NODE_ENV === "production"
//     ? undefined  // no pretty logs in production
//     : {
//         target: "pino-pretty",
//         options: {
//           colorize: true,
//           translateTime: "SYS:standard",
//         },
//       },
// },
// pino.destination("./logs/app.log") // 🔥 Save to a file
// );


// import pino from "pino";

// const isProd = process.env.NODE_ENV === "production";

// export const logger = pino(
//   {
//     level: isProd ? "info" : "debug",
//     transport: !isProd
//       ? {
//           target: "pino-pretty",
//           options: {
//             colorize: true,
//             translateTime: "SYS:standard",
//           },
//         }
//       : undefined, // No pretty logs in production
//   },
//   isProd
//     ? pino.multistream([
//         // General logs
//         { stream: pino.destination("./logs/app.log") },

//         // Error logs (only errors)
//         { level: "error", stream: pino.destination("./logs/error.log") },

//         // Everything (combined)
//         { level: "trace", stream: pino.destination("./logs/combined.log") },
//       ])
//     : undefined
// );

// trace (5)
// debug (10)
// info  (20)
// warn  (30)
// error (40)
// fatal (50)
