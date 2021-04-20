import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Json: any;
};


export type Mutation = {
  __typename?: 'Mutation';
  loginWithEmail: LoginResponse;
  loginWithPublicKey: LoginResponse;
  challenge: ChallengeResponse;
  verify: VerifyResponse;
};


export type MutationLoginWithEmailArgs = {
  appId: Scalars['String'];
  emailAddress: Scalars['String'];
};


export type MutationLoginWithPublicKeyArgs = {
  appId: Scalars['String'];
  publicKey: Scalars['String'];
};


export type MutationChallengeArgs = {
  appId: Scalars['String'];
  challengeType: Scalars['String'];
  code: Scalars['String'];
};


export type MutationVerifyArgs = {
  oneTimeToken: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  keys?: Maybe<PublicKey>;
  version?: Maybe<Version>;
};


export type QueryKeysArgs = {
  kid: Scalars['String'];
};

export type ActionResponse = {
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type PublicKey = {
  __typename?: 'PublicKey';
  id: Scalars['Int'];
  publicKey: Scalars['String'];
  validTo: Scalars['String'];
};

export type LoginResponse = ActionResponse & {
  __typename?: 'LoginResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  challenge?: Maybe<Scalars['String']>;
};

export type ChallengeResponse = ActionResponse & {
  __typename?: 'ChallengeResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type VerifyResponse = ActionResponse & {
  __typename?: 'VerifyResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  jwt: Scalars['String'];
  exchangeTokenUrl: Scalars['String'];
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  revision: Scalars['Int'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Json: ResolverTypeWrapper<Scalars['Json']>;
  Mutation: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Query: ResolverTypeWrapper<{}>;
  ActionResponse: ResolversTypes['LoginResponse'] | ResolversTypes['ChallengeResponse'] | ResolversTypes['VerifyResponse'];
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PublicKey: ResolverTypeWrapper<PublicKey>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  ChallengeResponse: ResolverTypeWrapper<ChallengeResponse>;
  VerifyResponse: ResolverTypeWrapper<VerifyResponse>;
  Version: ResolverTypeWrapper<Version>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Json: Scalars['Json'];
  Mutation: {};
  String: Scalars['String'];
  Query: {};
  ActionResponse: ResolversParentTypes['LoginResponse'] | ResolversParentTypes['ChallengeResponse'] | ResolversParentTypes['VerifyResponse'];
  Boolean: Scalars['Boolean'];
  PublicKey: PublicKey;
  Int: Scalars['Int'];
  LoginResponse: LoginResponse;
  ChallengeResponse: ChallengeResponse;
  VerifyResponse: VerifyResponse;
  Version: Version;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  loginWithEmail?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationLoginWithEmailArgs, 'appId' | 'emailAddress'>>;
  loginWithPublicKey?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationLoginWithPublicKeyArgs, 'appId' | 'publicKey'>>;
  challenge?: Resolver<ResolversTypes['ChallengeResponse'], ParentType, ContextType, RequireFields<MutationChallengeArgs, 'appId' | 'challengeType' | 'code'>>;
  verify?: Resolver<ResolversTypes['VerifyResponse'], ParentType, ContextType, RequireFields<MutationVerifyArgs, 'oneTimeToken'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  keys?: Resolver<Maybe<ResolversTypes['PublicKey']>, ParentType, ContextType, RequireFields<QueryKeysArgs, 'kid'>>;
  version?: Resolver<Maybe<ResolversTypes['Version']>, ParentType, ContextType>;
}>;

export type ActionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActionResponse'] = ResolversParentTypes['ActionResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoginResponse' | 'ChallengeResponse' | 'VerifyResponse', ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type PublicKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicKey'] = ResolversParentTypes['PublicKey']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  publicKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  validTo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  challenge?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChallengeResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChallengeResponse'] = ResolversParentTypes['ChallengeResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifyResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerifyResponse'] = ResolversParentTypes['VerifyResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  jwt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exchangeTokenUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VersionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Version'] = ResolversParentTypes['Version']> = ResolversObject<{
  major?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minor?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Json?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ActionResponse?: ActionResponseResolvers<ContextType>;
  PublicKey?: PublicKeyResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  ChallengeResponse?: ChallengeResponseResolvers<ContextType>;
  VerifyResponse?: VerifyResponseResolvers<ContextType>;
  Version?: VersionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
