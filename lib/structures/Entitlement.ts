import BaseEntitlement from "./BaseEntitlement";
import type { RawEntitlement } from "../types/applications";
import type Client from "../Client";
import type { JSONEntitlement } from "../types";

/** Represents an entitlement. */
export default class Entitlement extends BaseEntitlement {
    endsAt: Date | null;
    startsAt: Date | null;
    subscriptionID: string;
    constructor(data: RawEntitlement, client: Client) {
        super(data, client);
        this.endsAt = data.ends_at ? new Date(data.ends_at) : null;
        this.startsAt = data.starts_at ? new Date(data.starts_at) : null;
        this.subscriptionID = data.subscription_id;
    }

    override toJSON(): JSONEntitlement {
        return {
            ...super.toJSON(),
            endsAt:         this.endsAt?.getTime() || null,
            startsAt:       this.startsAt?.getTime() || null,
            subscriptionID: this.subscriptionID
        };
    }
}
