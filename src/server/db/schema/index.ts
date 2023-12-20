import * as enumSchema from "./enums";
import * as usersSchema from "./users";
import * as paymentsSchema from "./payments";
import * as relations from "./relations";

const schema = {
  ...enumSchema,
  ...usersSchema,
  ...paymentsSchema,
  ...relations,
};

export default schema;
