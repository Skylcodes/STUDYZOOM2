import { AppInfo } from '@/constants/app-info';

export enum UserCacheKey {
  OnboardingData,
  Favorites,
  ContactIsInFavorites,
  Profile,
  PersonalDetails,
  Preferences,
  MultiFactorAuthentication,
  Sessions,
  TransactionalEmails,
  MarketingEmails
}

// Legacy enum name - will be fully renamed in future phases
export enum OrganizationCacheKey {
  LeadGenerationData,
  Contacts, // Will be renamed to StudySets
  ContactTags, // Will be renamed to TopicTags
  Contact, // Will be renamed to StudySet
  ContactPageVisits, // Will be renamed to StudySetPageVisits
  ContactTimelineEvents, // Will be renamed to StudySetTimelineEvents
  ContactNotes, // Will be renamed to StudySetNotes
  ContactTasks, // Will be renamed to ActionItems
  OrganizationDetails, // Will be renamed to StudyGroupDetails
  BusinessHours, // Will be removed in future
  SocialMedia, // Will be removed in future
  Members, // Will be kept as Members
  Invitations, // Will be renamed to StudyGroupInvites
  ApiKeys,
  Webhooks
}

// New domain-aligned enum name - currently an alias to OrganizationCacheKey
export const StudyGroupCacheKey = OrganizationCacheKey;

export class Caching {
  private static readonly USER_PREFIX = 'user';
  private static readonly ORGANIZATION_PREFIX = 'organization'; // Will be renamed to 'studygroup' in future
  private static readonly STUDY_GROUP_PREFIX = 'studygroup'; // New prefix for domain-aligned naming

  private static joinKeyParts(...parts: string[]): string[] {
    return parts.filter((part) => part.length > 0);
  }

  private static joinTagParts(...parts: string[]): string {
    return parts.filter((part) => part.length > 0).join(':');
  }

  public static createUserKeyParts(
    key: UserCacheKey,
    userId: string,
    ...additionalKeyParts: string[]
  ): string[] {
    if (!userId) {
      throw new Error('User ID cannot be empty');
    }
    return this.joinKeyParts(
      this.USER_PREFIX,
      userId,
      UserCacheKey[key].toLowerCase(),
      ...additionalKeyParts
    );
  }

  public static createUserTag(
    key: UserCacheKey,
    userId: string,
    ...additionalTagParts: string[]
  ): string {
    if (!userId) {
      throw new Error('User ID cannot be empty');
    }
    return this.joinTagParts(
      this.USER_PREFIX,
      userId,
      UserCacheKey[key].toLowerCase(),
      ...additionalTagParts
    );
  }

  // Will be renamed to createStudyGroupKeyParts in future
  public static createOrganizationKeyParts(
    key: OrganizationCacheKey,
    userId: string,
    ...additionalKeyParts: string[]
  ): string[] {
    if (!userId) {
      throw new Error('User ID cannot be empty');
    }
    // Using user ID instead of organization ID after pivot to document-centric model
    return this.joinKeyParts(
      this.ORGANIZATION_PREFIX,
      userId, // Using userId instead of organizationId
      OrganizationCacheKey[key].toLowerCase(),
      ...additionalKeyParts
    );
  }

  // Will be renamed to createStudyGroupTag in future
  public static createOrganizationTag(
    key: OrganizationCacheKey,
    organizationId: string, // Will be renamed to studyGroupId in future
    ...additionalTagParts: string[]
  ): string {
    if (!organizationId) {
      throw new Error('Organization ID cannot be empty'); // Will be updated to 'Study Group ID cannot be empty'
    }
    return this.joinTagParts(
      this.ORGANIZATION_PREFIX,
      organizationId,
      OrganizationCacheKey[key].toLowerCase(),
      ...additionalTagParts
    );
  }

  // New domain-aligned methods
  public static createStudyGroupKeyParts(
    key: OrganizationCacheKey,
    studyGroupId: string,
    ...additionalKeyParts: string[]
  ): string[] {
    if (!studyGroupId) {
      throw new Error('Study Group ID cannot be empty');
    }
    return this.joinKeyParts(
      this.STUDY_GROUP_PREFIX,
      studyGroupId,
      OrganizationCacheKey[key].toLowerCase(),
      ...additionalKeyParts
    );
  }

  public static createStudyGroupTag(
    key: OrganizationCacheKey,
    studyGroupId: string,
    ...additionalTagParts: string[]
  ): string {
    if (!studyGroupId) {
      throw new Error('Study Group ID cannot be empty');
    }
    return this.joinTagParts(
      this.STUDY_GROUP_PREFIX,
      studyGroupId,
      OrganizationCacheKey[key].toLowerCase(),
      ...additionalTagParts
    );
  }
}

export const defaultRevalidateTimeInSeconds = AppInfo.PRODUCTION ? 3600 : 120;
