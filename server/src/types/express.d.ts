// import { Express } from "express";

// export declare namespace Express {
//     interface Request {
//         user?: {
//             id: string
//         };
//     }
// };

// declare global {
//   namespace Express {
//     interface Request {
//       cookies?: any;
//       user?: { id: string };
//     };
//   }
// };

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// export {}

