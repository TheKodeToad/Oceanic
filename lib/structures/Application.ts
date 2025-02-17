/** @module Application */
import ClientApplication from "./ClientApplication";
import OAuthGuild from "./OAuthGuild";
import User from "./User";
import Team from "./Team";
import type Client from "../Client";
import type { InstallParams } from "../types/oauth";
import type {
    ApplicationDiscoverabilityState,
    ApplicationEventWebhookEventType,
    ApplicationEventWebhookStatus,
    ApplicationExplicitContentFilterLevel,
    ApplicationIntegrationTypes,
    ApplicationMonetizationState,
    ApplicationVerificationState,
    ImageFormat,
    RPCApplicationState,
    StoreApplicationState
} from "../Constants";
import * as Routes from "../util/Routes";
import type { JSONApplication } from "../types/json";
import type { IntegrationTypesConfig, RESTApplication } from "../types";

/** Represents an application. */
export default class Application extends ClientApplication {
    /** The approximate number of guilds the application is in. */
    approximateGuildCount: number;
    /** The approximate number of users this application has been installed by. */
    approximateUserInstallCount: number;
    /** If the bot can be invited by anyone. */
    botPublic?: boolean;
    /** If authorizing the bot requires a code grant. */
    botRequireCodeGrant?: boolean;
    /** This application's rich presence invite cover image hash, if any. */
    coverImage: string | null;
    /** This application's default custom authorization link, if any. */
    customInstallURL?: string;
    /** The description of the application. */
    description: string;
    /** The state of this application's discoverability. */
    discoverabilityState?: ApplicationDiscoverabilityState;
    /** The { @link Constants~ApplicationDiscoveryEligibilityFlags | flags } for this application's discovery eligibility. */
    discoveryEligibilityFlags?: number;
    /** If webhook events are enabled for the app. */
    eventWebhooksStatus: ApplicationEventWebhookStatus;
    /**	List of Webhook event types the app subscribes to. */
    eventWebhooksTypes?: Array<ApplicationEventWebhookEventType>;
    /** Event webhooks URL for the app to receive webhook events. */
    eventWebhooksURL?: string | null;
    /** The explicit content filter for this application. */
    explicitContentFilter?: ApplicationExplicitContentFilterLevel;
    /** If this application is a game sold on Discord, the guild to which it has been linked. This will only be present if recieved via {@link REST/Applications.getCurrent | `/applications/@me`}. */
    guild: OAuthGuild | null;
    /** If this application is a game sold on Discord, the ID of the guild to which it has been linked. */
    guildID: string | null;
    hook: boolean;
    /** The icon hash of the application. */
    icon: string | null;
    /** Settings for this application's in-app authorization link, if enabled. */
    installParams?: InstallParams;
    /** The install types available for this application. */
    integrationTypes: Array<ApplicationIntegrationTypes>;
    /** The configs for the install types available for this application. */
    integrationTypesConfig: IntegrationTypesConfig;
    /** This applications interaction endpoint url, if any. */
    interactionsEndpointURL: string | null;
    /** The event types that will be recieved like http interactions, if interactionsVersion is 2. */
    interactionsEventTypes?: Array<string>;
    /** The interactions version of this application. */
    interactionsVersion?: number;
    /** If this application is monetized. */
    isMonetized: boolean;
    /** The { @link Constants~ApplicationMonetizationEligibilityFlags | flags } for this application's monetization eligibility. */
    monetizationEligibilityFlags?: number;
    /** This application's monetization state. */
    monetizationState?: ApplicationMonetizationState;
    /** The name of the application. */
    name: string;
    /** The owner of this application. */
    owner: User | null;
    /** If this application is a game sold on Discord, the id of the Game's SKU. */
    primarySKUID?: string;
    /** A URL to this application's privacy policy. */
    privacyPolicyURL?: string;
    /** The redirect URIs for this application. */
    redirectURIs: Array<string>;
    /** This application's role connections verification url, if any. */
    roleConnectionsVerificationURL: string | null;
    /** The state of this application's RPC application. */
    rpcApplicationState?: RPCApplicationState;
    /** A list of rpc origin urls, if rpc is enabled. */
    rpcOrigins: Array<string>;
    /** If this application is a game sold on Discord, the slug that links to its store page. */
    slug?: string;
    /** The state of this application's store application state. */
    storeApplicationState?: StoreApplicationState;
    /** The tags for this application. */
    tags: Array<string>;
    /** The team that owns this application. */
    team: Team | null;
    /** A URL to this application's terms of service. */
    termsOfServiceURL?: string;
    /** The type of this application. */
    type: number | null;
    /** The state of this application's verification. */
    verificationState?: ApplicationVerificationState;
    /** The bot's hex encoded public key. */
    verifyKey: string;
    constructor(data: RESTApplication, client: Client) {
        super(data, client);
        this.approximateGuildCount = data.approximate_guild_count ?? 0;
        this.approximateUserInstallCount = data.approximate_user_install_count ?? 0;
        this.botPublic = data.bot_public;
        this.botRequireCodeGrant  = data.bot_require_code_grant;
        this.coverImage = data.cover_image ?? null;
        this.description = data.description;
        this.discoverabilityState = data.discoverability_state;
        this.discoveryEligibilityFlags = data.discovery_eligibility_flags;
        this.eventWebhooksStatus = data.event_webhooks_status;
        this.eventWebhooksTypes = data.event_webhooks_types;
        this.eventWebhooksURL = data.event_webhooks_url;
        this.explicitContentFilter = data.explicit_content_filter;
        this.guild = data.guild === undefined ? null : new OAuthGuild(data.guild, client);
        this.guildID = data.guild_id ?? null;
        this.hook = data.hook;
        this.icon = data.icon;
        this.installParams = data.install_params;
        this.integrationTypes = [];
        this.integrationTypesConfig = {};
        this.interactionsEndpointURL = null;
        this.interactionsEventTypes = data.interactions_event_types;
        this.interactionsVersion = data.interactions_version;
        this.isMonetized = data.is_monetized;
        this.monetizationEligibilityFlags = data.monetization_eligibility_flags;
        this.monetizationState = data.monetization_state;
        this.name = data.name;
        this.owner = data.owner === undefined ? null : new User(data.owner, client);
        this.primarySKUID = data.primary_sku_id;
        this.privacyPolicyURL = data.privacy_policy_url;
        this.redirectURIs = data.redirect_uris ?? [];
        this.roleConnectionsVerificationURL = null;
        this.rpcApplicationState = data.rpc_application_state;
        this.rpcOrigins = data.rpc_origins ?? [];
        this.slug = data.slug;
        this.storeApplicationState = data.store_application_state;
        this.tags = data.tags ?? [];
        this.team = data.team ? new Team(data.team, client) : null;
        this.termsOfServiceURL = data.terms_of_service_url;
        this.type = data.type;
        this.verificationState  = data.verification_state;
        this.verifyKey = data.verify_key;
        this.update(data);
    }

    /**
     * The url of this application's cover image.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    coverImageURL(format?: ImageFormat, size?: number): string | null {
        return this.coverImage === null ? null : this.client.util.formatImage(Routes.APPLICATION_COVER(this.id, this.coverImage), format, size);
    }

    /**
     * The url of this application's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    iconURL(format?: ImageFormat, size?: number): string | null {
        return this.icon === null ? null : this.client.util.formatImage(Routes.APPLICATION_ICON(this.id, this.icon), format, size);
    }

    override toJSON(): JSONApplication {
        return {
            ...super.toJSON(),
            approximateGuildCount:          this.approximateGuildCount,
            botPublic:                      this.botPublic,
            botRequireCodeGrant:            this.botRequireCodeGrant,
            coverImage:                     this.coverImage,
            customInstallURL:               this.customInstallURL,
            description:                    this.description,
            discoverabilityState:           this.discoverabilityState,
            discoveryEligibilityFlags:      this.discoveryEligibilityFlags,
            explicitContentFilter:          this.explicitContentFilter,
            guild:                          this.guild?.toJSON() ?? null,
            guildID:                        this.guildID,
            hook:                           this.hook,
            icon:                           this.icon,
            installParams:                  this.installParams,
            integrationTypes:               this.integrationTypes,
            integrationTypesConfig:         this.integrationTypesConfig,
            interactionsEndpointURL:        this.interactionsEndpointURL,
            interactionsEventTypes:         this.interactionsEventTypes,
            interactionsVersion:            this.interactionsVersion,
            isMonetized:                    this.isMonetized,
            monetizationEligibilityFlags:   this.monetizationEligibilityFlags,
            monetizationState:              this.monetizationState,
            name:                           this.name,
            owner:                          this.owner?.toJSON() ?? null,
            primarySKUID:                   this.primarySKUID,
            privacyPolicyURL:               this.privacyPolicyURL,
            redirectURIs:                   this.redirectURIs,
            roleConnectionsVerificationURL: this.roleConnectionsVerificationURL,
            rpcApplicationState:            this.rpcApplicationState,
            rpcOrigins:                     this.rpcOrigins,
            slug:                           this.slug,
            storeApplicationState:          this.storeApplicationState,
            tags:                           this.tags,
            team:                           this.team?.toJSON() ?? null,
            termsOfServiceURL:              this.termsOfServiceURL,
            type:                           this.type,
            verificationState:              this.verificationState,
            verifyKey:                      this.verifyKey
        };
    }
}
