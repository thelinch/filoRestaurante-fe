import { v4 as uuidv4 } from "uuid";

const util = {
  generateId: function (object: any) {
    return { ...object, id: uuidv4() };
  },
};
export default util;
