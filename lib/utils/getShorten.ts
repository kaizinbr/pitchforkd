
import { customAlphabet } from "nanoid";

const getShorten = (): string => {
    const nanoid = customAlphabet("6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz", 10);
    return nanoid();
};

export default getShorten;