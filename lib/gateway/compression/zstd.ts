import Compression from "./base";
import type Shard from "../Shard";
import { NotImplementedError } from "../../util/Errors";

export default class ZstdCompression extends Compression {
    constructor(shard: Shard) {
        super(shard);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async decompress(_data: Buffer): Promise<Buffer> {
        throw new NotImplementedError("zstd-stream compression has been temporarily removed");
    }
}
