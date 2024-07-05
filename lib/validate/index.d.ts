import { PROXY_LIST } from "../../types/actions.d.ts";

export type VALIDATE_RESULT = {
  status: "success";
  message: null;
  body: PROXY_LIST;
} | {
  status: "error";
  message: string;
  body: null;
};
