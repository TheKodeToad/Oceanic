import Base from "./Base";
import type Client from "../Client";
import type { SubscriptionStatuses } from "../Constants";
import type { RawSubscription } from "../types";

export default class Subscription extends Base {
    /** When the subscription was canceled. */
    canceledAt: Date | null;
    /** ISO3166-1 alpha-2 country code of the payment source used to purchase the subscription. Missing unless queried with a private OAuth scope. */
    country?: string;
    /** End of the current subscription period. */
    currentPeriodEnd: Date;
    /** Start of the current subscription period. */
    currentPeriodStart: Date;
    /** List of entitlements granted for this subscription. */
    entitlementIDs: Array<string>;
    /** List of SKUs that this user will be subscribed to at renewal. */
    renewalSKUIDs: Array<string>;
    /** List of SKUs subscribed to. */
    skuIDs: Array<string>;
    /** Current status of the subscription. */
    status: SubscriptionStatuses;
    /**	ID of the user who is subscribed. */
    userID: string;
    constructor(data: RawSubscription, client: Client) {
        super(data.id, client);
        this.canceledAt = data.canceled_at ? new Date(data.canceled_at) : null;
        this.country = data.country;
        this.currentPeriodEnd = new Date(data.current_period_end);
        this.currentPeriodStart = new Date(data.current_period_start);
        this.entitlementIDs = data.entitlement_ids;
        this.renewalSKUIDs = data.renewal_sku_ids;
        this.skuIDs = data.sku_ids;
        this.status = data.status;
        this.userID = data.user_id;
    }
}
