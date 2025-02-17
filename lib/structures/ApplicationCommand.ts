/** @module ApplicationCommand */
import Base from "./Base";
import Permission from "./Permission";
import type Guild from "./Guild";
import type ClientApplication from "./ClientApplication";
import type Client from "../Client";
import { ApplicationCommandTypes, type InteractionContextTypes, type ApplicationIntegrationTypes, type EntryPointCommandHandlerTypes } from "../Constants";
import type {
    ApplicationCommandOptionConversion,
    ApplicationCommandOptions,
    EditApplicationCommandPermissionsOptions,
    LocaleMap,
    RawApplicationCommand,
    RESTGuildApplicationCommandPermissions,
    TypeToEdit
} from "../types/applications";
import type { JSONApplicationCommand } from "../types/json";
import { UncachedError } from "../util/Errors";

/** Represents an application command. */
export default class ApplicationCommand<T extends ApplicationCommandTypes = ApplicationCommandTypes> extends Base {
    private _cachedGuild?: Guild | null;
    /** The application this command is for. */
    application?: ClientApplication;
    /** The ID of application this command is for. */
    applicationID: string;
    /** The contexts in which this application command can be used in. */
    contexts: Array<InteractionContextTypes>;
    /** The default permissions for this command. */
    defaultMemberPermissions: Permission | null;
    /** The description of this command. Empty string for non `CHAT_INPUT` commands. */
    description: T extends ApplicationCommandTypes.CHAT_INPUT ? string : "";
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. */
    descriptionLocalizations?: LocaleMap | null;
    /** The description of this application command in the requested locale. */
    descriptionLocalized?: string;
    /** If this command can be used in direct messages (global commands only). */
    dmPermission?: boolean;
    /** The id of the guild this command is in (guild commands only). */
    guildID: string | null;
    /** The handler of this command. Only valid for `PRIMARY_ENTRY_POINT` commands. */
    handler?: EntryPointCommandHandlerTypes;
    /** The installation contexts in which this command is available. */
    integrationTypes: Array<ApplicationIntegrationTypes>;
    /** The name of this command. */
    name: string;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names. */
    nameLocalizations?: LocaleMap | null;
    /** The description of this application command in the requested locale. */
    nameLocalized?: string;
    /** Whether the command is age restricted. */
    nsfw?: boolean;
    /** The options on this command. Only valid for `CHAT_INPUT`. */
    options?: Array<ApplicationCommandOptions>;
    /** The [type](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types) of this command. */
    type: T;
    /** Autoincrementing version identifier updated during substantial record changes. */
    version: string;
    constructor(data: RawApplicationCommand, client: Client) {
        super(data.id, client);
        this.application = client["_application"] && client.application.id === data.application_id ? client.application : undefined;
        this.applicationID = data.application_id;
        this.contexts = data.contexts;
        this.defaultMemberPermissions = data.default_member_permissions ? new Permission(data.default_member_permissions) : null;
        this.description = data.description as never;
        this.descriptionLocalizations = data.description_localizations;
        this.descriptionLocalized = data.description_localized;
        this.dmPermission = data.dm_permission;
        this.guildID = data.guild_id ?? null;
        this.handler = data.handler;
        this.integrationTypes = data.integration_types;
        this.name = data.name;
        this.nameLocalizations = data.name_localizations;
        this.nameLocalized = data.name_localized;
        this.nsfw = data.nsfw;
        this.options = data.options?.map(o => client.util.optionToParsed(o));
        this.type = (data.type ?? ApplicationCommandTypes.CHAT_INPUT) as T;
        this.version = data.version;
    }

    /** The guild this command is in (guild commands only). This will throw an error if the guild is not cached. */
    get guild(): Guild | null {
        if (this.guildID !== null && this._cachedGuild !== null) {
            this._cachedGuild ??= this.client.guilds.get(this.guildID);
            if (!this._cachedGuild) {
                throw new UncachedError(this, "guild", "GUILDS", this.client);
            }

            return this._cachedGuild;
        }

        return this._cachedGuild === null ? this._cachedGuild : (this._cachedGuild = null);
    }

    /**
     * Delete this command.
     */
    async delete(): Promise<void> {
        return this.guildID ? this.client.rest.applications.deleteGuildCommand(this.applicationID, this.guildID, this.id) : this.client.rest.applications.deleteGlobalCommand(this.applicationID, this.id);
    }

    /**
     * Edit this command.
     * @param options The options for editing the command.
     */
    async edit(options: TypeToEdit<T>): Promise<ApplicationCommandOptionConversion<TypeToEdit<T>>> {
        return this.guildID ? this.client.rest.applications.editGuildCommand(this.applicationID, this.guildID, this.id, options) : this.client.rest.applications.editGlobalCommand(this.applicationID, this.id, options);
    }

    /**
     * Edit this command's permissions (guild commands only). This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param options The options for editing the permissions.
     */
    async editGuildCommandPermissions(options: EditApplicationCommandPermissionsOptions): Promise<RESTGuildApplicationCommandPermissions> {
        if (!this.guildID) {
            throw new TypeError("editGuildCommandPermissions cannot be used on global commands.");
        }
        return this.client.rest.applications.editGuildCommandPermissions(this.applicationID, this.guildID, this.id, options);
    }

    /**
     * Get this command's permissions (guild commands only).
     */
    async getGuildPermission(): Promise<RESTGuildApplicationCommandPermissions> {
        if (!this.guildID) {
            throw new TypeError("getGuildPermission cannot be used on global commands.");
        }
        return this.client.rest.applications.getGuildPermission(this.applicationID, this.guildID, this.id);
    }

    /**
     * Get a mention for this command.
     * @param sub The subcommand group and/or subcommand to include (["subcommand"] or ["subcommand-group", "subcommand"]).
     */
    mention(sub?: [subcommand: string] | [subcommandGroup: string, subcommand: string]): string {
        let text = `${this.name}`;
        if (sub?.length) {
            text += ` ${sub.slice(0, 2).join(" ")}`;
        }
        return `</${text}:${this.id}>`;
    }

    override toJSON(): JSONApplicationCommand {
        return {
            ...super.toJSON(),
            applicationID:            this.applicationID,
            contexts:                 this.contexts,
            defaultMemberPermissions: this.defaultMemberPermissions?.toJSON(),
            description:              this.description,
            descriptionLocalizations: this.descriptionLocalizations,
            dmPermission:             this.dmPermission,
            guildID:                  this.guildID ?? undefined,
            handler:                  this.handler,
            integrationTypes:         this.integrationTypes,
            name:                     this.name,
            nameLocalizations:        this.nameLocalizations,
            nsfw:                     this.nsfw,
            options:                  this.options,
            type:                     this.type,
            version:                  this.version
        };
    }
}
