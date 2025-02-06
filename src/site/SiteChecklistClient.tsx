'use client';

import {
  ComponentProps,
  ReactNode,
} from 'react';
import { clsx } from 'clsx/lite';
import ChecklistRow from '../components/ChecklistRow';
import { FiExternalLink } from 'react-icons/fi';
import {
  BiCog,
  BiData,
  BiHide,
  BiLockAlt,
  BiPencil,
} from 'react-icons/bi';
import Checklist from '@/components/Checklist';
import { ConfigChecklistStatus } from './config';
import StatusIcon from '@/components/StatusIcon';
import { labelForStorage } from '@/services/storage';
import { HiSparkles } from 'react-icons/hi';
import { testConnectionsAction } from '@/admin/actions';
import ErrorNote from '@/components/ErrorNote';
import WarningNote from '@/components/WarningNote';
import { RiSpeedMiniLine } from 'react-icons/ri';
import Link from 'next/link';
import SecretGenerator from './SecretGenerator';
import CopyButton from '@/components/CopyButton';
import { PiPaintBrushHousehold } from 'react-icons/pi';
import { IoMdGrid } from 'react-icons/io';
import { CgDebug } from 'react-icons/cg';

export default function SiteChecklistClient({
  // Storage
  hasDatabase,
  isPostgresSslEnabled,
  hasVercelPostgres,
  hasVercelKv,
  hasStorageProvider,
  hasVercelBlobStorage,
  hasCloudflareR2Storage,
  hasAwsS3Storage,
  hasMultipleStorageProviders,
  currentStorage,
  // Auth
  hasAuthSecret,
  hasAdminUser,
  // Content
  hasDomain,
  hasTitle,
  hasDescription,
  hasAbout,
  // AI
  isAiTextGenerationEnabled,
  aiTextAutoGeneratedFields,
  hasAiTextAutoGeneratedFields,
  // Performance
  isStaticallyOptimized,
  arePhotosStaticallyOptimized,
  arePhotoOGImagesStaticallyOptimized,
  arePhotoCategoriesStaticallyOptimized,
  arePhotoCategoryOgImagesStaticallyOptimized,
  areOriginalUploadsPreserved,
  imageQuality,
  hasImageQuality,
  isBlurEnabled,
  // Visual
  hasDefaultTheme,
  defaultTheme,
  arePhotosMatted,
  // Display
  showExifInfo,
  showZoomControls,
  showTakenAtTimeHidden,
  showSocial,
  showFilmSimulations,
  showRepoLink,
  // Grid
  isGridHomepageEnabled,
  gridAspectRatio,
  hasGridAspectRatio,
  gridDensity,
  hasGridDensityPreference,
  // Settings
  isGeoPrivacyEnabled,
  arePublicDownloadsEnabled,
  isPublicApiEnabled,
  isPriorityOrderEnabled,
  isOgTextBottomAligned,
  // Internal
  areInternalToolsEnabled,
  areAdminDebugToolsEnabled,
  isAdminDbOptimizeEnabled,
  isAdminSqlDebugEnabled,
  // Misc
  baseUrl,
  commitSha,
  commitMessage,
  commitUrl,
  // Connection status
  databaseError,
  storageError,
  kvError,
  aiError,
  // Component props
  simplifiedView,
  isAnalyzingConfiguration,
}: ConfigChecklistStatus &
  Partial<Awaited<ReturnType<typeof testConnectionsAction>>> & {
  simplifiedView?: boolean
  isAnalyzingConfiguration?: boolean
}) {
  const renderLink = (href: string, text: string, external = true) =>
    <>
      <a {...{
        href,
        ...external && { target: '_blank', rel: 'noopener noreferrer' },
        className: clsx(
          'underline hover:no-underline',
        ),
      }}>
        {text}
      </a>
      {external &&
        <>
          &nbsp;
          <FiExternalLink
            size={14}
            className='inline translate-y-[-1.5px]'
          />
        </>}
    </>;

  const renderEnvVar = (
    variable: string,
    minimal?: boolean,
  ) =>
    <div
      key={variable}
      className={clsx(
        'overflow-x-auto overflow-y-hidden',
        minimal && 'inline-flex',
      )}
    >
      <span className="inline-flex items-center gap-1">
        <span className={clsx(
          'text-[11px] font-medium tracking-wider',
          'px-0.5 py-[0.5px]',
          'rounded-[5px]',
          'bg-gray-100 dark:bg-gray-800',
        )}>
          `{variable}`
        </span>
        {!minimal && <CopyButton label={variable} text={variable} subtle />}
      </span>
    </div>;

  const renderEnvVars = (variables: string[]) =>
    <div className="pt-1 space-y-1">
      {variables.map(envVar => renderEnvVar(envVar))}
    </div>;

  const renderSubStatus = (
    type: ComponentProps<typeof StatusIcon>['type'],
    label: ReactNode,
    iconClassName?: string,
  ) =>
    <div className="flex gap-2 translate-x-[-3px]">
      <span className={iconClassName}>
        <StatusIcon {...{ type }} />
      </span>
      <span className="min-w-0">
        {label}
      </span>
    </div>;
    
  const renderSubStatusWithEnvVar = (
    type: ComponentProps<typeof StatusIcon>['type'],
    variable: string,
  ) =>
    renderSubStatus(
      type,
      renderEnvVars([variable]),
      'translate-y-[5px]',
    );

  const renderError = ({
    connection,
    message,
  }: {
    connection?: { provider: string, error: string }
    message?: string
  }) =>
    <ErrorNote className="mt-2 mb-3">
      {connection && <>
        {connection.provider} connection error: {`"${connection.error}"`}
      </>}
      {message}
    </ErrorNote>;

  const renderWarning = ({
    connection,
    message,
  }: {
    connection?: { provider: string, error: string }
    message?: string
  }) =>
    <WarningNote className="mt-2 mb-3">
      {connection && <>
        {connection.provider} connection error: {`"${connection.error}"`}
      </>}
      {message}
    </WarningNote>;

  return (
    <div className="max-w-xl w-full">
      <div className="space-y-3 -mt-3">
        <Checklist
          title="Storage"
          icon={<BiData size={16} />}
        >
          <ChecklistRow
            title={hasDatabase && isAnalyzingConfiguration
              ? 'Testing database connection'
              : 'Setup database'}
            status={hasDatabase}
            isPending={hasDatabase && isAnalyzingConfiguration}
          >
            {databaseError && renderError({
              connection: { provider: 'Database', error: databaseError},
            })}
            {hasVercelPostgres
              ? renderSubStatus('checked', 'Vercel Postgres: connected')
              : renderSubStatus('optional', <>
                Vercel Postgres:
                {' '}
                {renderLink(
                  // eslint-disable-next-line max-len
                  'https://vercel.com/docs/storage/vercel-postgres/quickstart#create-a-postgres-database',
                  'create store',
                )}
                {' '}
                and connect to project
              </>)}
            {hasDatabase && !hasVercelPostgres &&
              renderSubStatus('checked', <>
                Postgres-compatible: connected
                {' '}
                (SSL {isPostgresSslEnabled ? 'enabled' : 'disabled'})
              </>)}
          </ChecklistRow>
          <ChecklistRow
            title={
              hasStorageProvider && isAnalyzingConfiguration
                ? 'Testing storage connection'
                : !hasStorageProvider
                  ? 'Setup storage (one of the following)'
                  : hasMultipleStorageProviders
                    // eslint-disable-next-line max-len
                    ? `Setup storage (new uploads go to: ${labelForStorage(currentStorage)})`
                    : 'Setup storage'}
            status={hasStorageProvider}
            isPending={hasStorageProvider && isAnalyzingConfiguration}
          >
            {storageError && renderError({
              connection: { provider: 'Storage', error: storageError},
            })}
            {hasVercelBlobStorage
              ? renderSubStatus('checked', 'Vercel Blob: connected')
              : renderSubStatus('optional', <>
                {labelForStorage('vercel-blob')}:
                {' '}
                {renderLink(
                  // eslint-disable-next-line max-len
                  'https://vercel.com/docs/storage/vercel-blob/quickstart#create-a-blob-store',
                  'create store',
                )}
                {' '} 
                and connect to project
              </>,
              )}
            {hasCloudflareR2Storage
              ? renderSubStatus('checked', 'Cloudflare R2: connected')
              : renderSubStatus('optional', <>
                {labelForStorage('cloudflare-r2')}:
                {' '}
                {renderLink(
                  'https://github.com/sambecker/exif-photo-blog#cloudflare-r2',
                  'create/configure bucket',
                )}
              </>)}
            {hasAwsS3Storage
              ? renderSubStatus('checked', 'AWS S3: connected')
              : renderSubStatus('optional', <>
                {labelForStorage('aws-s3')}:
                {' '}
                {renderLink(
                  'https://github.com/sambecker/exif-photo-blog#aws-s3',
                  'create/configure bucket',
                )}
              </>)}
          </ChecklistRow>
        </Checklist>
        <Checklist
          title="Authentication"
          icon={<BiLockAlt size={16} />}
        >
          <ChecklistRow
            title={!hasAuthSecret && isAnalyzingConfiguration
              ? 'Generating secret'
              : 'Setup auth'}
            status={hasAuthSecret}
            isPending={!hasAuthSecret && isAnalyzingConfiguration}
          >
            Store auth secret in environment variable:
            {!hasAuthSecret &&
              <div className="overflow-x-auto">
                <SecretGenerator />
              </div>}
            {renderEnvVars(['AUTH_SECRET'])}
          </ChecklistRow>
          <ChecklistRow
            title="Setup admin user"
            status={hasAdminUser}
          >
            Store admin email/password
            {' '}
            in environment variables:
            {renderEnvVars([
              'ADMIN_EMAIL',
              'ADMIN_PASSWORD',
            ])}
          </ChecklistRow>
        </Checklist>
        <Checklist
          title="Content"
          icon={<BiPencil size={16} />}
        >
          <ChecklistRow
            title="Configure domain"
            status={hasDomain}
            showWarning
          >
            {!hasDomain &&
              renderWarning({message:
                'Not explicitly setting a domain may cause ' + 
                'certain features to behave unexpectedly',
              })}
            Store in environment variable (seen in top-right nav):
            {renderEnvVars(['NEXT_PUBLIC_SITE_DOMAIN'])}
          </ChecklistRow>
          <ChecklistRow
            title="Add title"
            status={hasTitle}
            optional
          >
            Store in environment variable (seen in browser tab):
            {renderEnvVars(['NEXT_PUBLIC_SITE_TITLE'])}
          </ChecklistRow>
          <ChecklistRow
            title="Add description"
            status={hasDescription}
            optional
          >
            Store in environment variable (seen in nav, under title):
            {renderEnvVars(['NEXT_PUBLIC_SITE_DESCRIPTION'])}
          </ChecklistRow>
          <ChecklistRow
            title="Add about"
            status={hasAbout}
            optional
          >
            Store in environment variable (seen in grid sidebar):
            {renderEnvVars(['NEXT_PUBLIC_SITE_ABOUT'])}
          </ChecklistRow>
        </Checklist>
        {!simplifiedView && <>
          <Checklist
            title="AI text generation"
            titleShort="AI"
            icon={<HiSparkles />}
            optional
          >
            <ChecklistRow
              title={isAiTextGenerationEnabled && isAnalyzingConfiguration
                ? 'Testing OpenAI connection'
                : 'Add OpenAI secret key'}
              status={isAiTextGenerationEnabled}
              isPending={isAiTextGenerationEnabled && isAnalyzingConfiguration}
              optional
            >
              {aiError && renderError({
                connection: { provider: 'OpenAI', error: aiError},
              })}
              Store your OpenAI secret key in order to add experimental support
              for AI-generated text descriptions and enable an invisible field
              called {'"Semantic Description"'} used to support CMD-K search:
              {renderEnvVars(['OPENAI_SECRET_KEY'])}
            </ChecklistRow>
            <ChecklistRow
              title={hasVercelKv && isAnalyzingConfiguration
                ? 'Testing KV connection'
                : 'Enable rate limiting'}
              status={hasVercelKv}
              isPending={hasVercelKv && isAnalyzingConfiguration}
              optional
            >
              {kvError && renderError({
                connection: { provider: 'Vercel KV', error: kvError},
              })}
              {renderLink(
                // eslint-disable-next-line max-len
                'https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database',
                'Create Vercel KV store',
              )}
              {' '}
              and connect to project in order to enable rate limiting
            </ChecklistRow>
            <ChecklistRow
              // eslint-disable-next-line max-len
              title={`Auto-generated fields: ${aiTextAutoGeneratedFields.join(', ')}`}
              status={hasAiTextAutoGeneratedFields}
              optional
            >
              Comma-separated fields to auto-generate when
              uploading photos. Accepted values: title, caption,
              tags, description, all, or none
              {' '}
              (default: {'"title, tags, semantic"'}):
              {renderEnvVars(['AI_TEXT_AUTO_GENERATED_FIELDS'])}
            </ChecklistRow>
          </Checklist>
          <Checklist
            title="Performance"
            icon={<RiSpeedMiniLine size={18} />}
            optional
          >
            <ChecklistRow
              title="Static optimization"
              status={isStaticallyOptimized}
              optional
            >
              Set environment variable to {'"1"'} to make site more responsive
              by enabling static optimization
              (i.e., rendering pages and images at build time):
              {renderSubStatusWithEnvVar(
                arePhotosStaticallyOptimized ? 'checked' : 'optional',
                'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTOS',
              )}
              {renderSubStatusWithEnvVar(
                arePhotoOGImagesStaticallyOptimized ? 'checked' : 'optional',
                'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_OG_IMAGES',
              )}
              {renderSubStatusWithEnvVar(
                arePhotoCategoriesStaticallyOptimized ? 'checked' : 'optional',
                'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORIES',
              )}
              {renderSubStatusWithEnvVar(
                // eslint-disable-next-line max-len
                arePhotoCategoryOgImagesStaticallyOptimized ? 'checked' : 'optional',
                'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORY_OG_IMAGES',
              )}
            </ChecklistRow>
            <ChecklistRow
              title="Preserve original uploads"
              status={areOriginalUploadsPreserved}
              optional
            >
              Set environment variable to {'"1"'} to prevent
              image uploads being compressed before storing:
              {renderEnvVars(['NEXT_PUBLIC_PRESERVE_ORIGINAL_UPLOADS'])}
            </ChecklistRow>
            <ChecklistRow
              title={`Image quality: ${imageQuality}`}
              status={hasImageQuality}
              optional
            >
              Set environment variable from {'"1-100"'}
              {' '}
              to control the quality of large photos
              ({'"100"'} represents highest quality/largest size):
              {renderEnvVars(['NEXT_PUBLIC_IMAGE_QUALITY'])}
            </ChecklistRow>
            <ChecklistRow
              title="Image blur"
              status={isBlurEnabled}
              optional
            >
              Set environment variable to {'"1"'} to prevent
              image blur data being stored and displayed:
              {renderEnvVars(['NEXT_PUBLIC_BLUR_DISABLED'])}
            </ChecklistRow>
          </Checklist>
          <Checklist
            title="Visual"
            icon={<PiPaintBrushHousehold size={19} />}
            optional
          >
            <ChecklistRow
              title={`Default theme: ${defaultTheme}`}
              status={hasDefaultTheme}
              optional
            >
              {'Set environment variable to \'light\' or \'dark\''}
              {' '}
              to configure initial theme
              {' '}
              (defaults to {'\'system\''}):
              {renderEnvVars(['NEXT_PUBLIC_DEFAULT_THEME'])}
            </ChecklistRow>
            <ChecklistRow
              title="Photo matting"
              status={arePhotosMatted}
              optional
            >
              Set environment variable to {'"1"'} to constrain the size
              {' '}
              of each photo, and display a surrounding border:
              {renderEnvVars(['NEXT_PUBLIC_MATTE_PHOTOS'])}
            </ChecklistRow>
          </Checklist>
          <Checklist
            title="Display"
            icon={<BiHide size={18} />}
            optional
          >
            <ChecklistRow
              title="Show EXIF data"
              status={showExifInfo}
              optional
            >
              Set environment variable to {'"1"'} to hide EXIF data:
              {renderEnvVars(['NEXT_PUBLIC_HIDE_EXIF_DATA'])}
            </ChecklistRow>
            <ChecklistRow
              title="Show zoom controls"
              status={showZoomControls}
              optional
            >
              Set environment variable to {'"1"'} to hide
              fullscreen photo zoom controls:
              {renderEnvVars(['NEXT_PUBLIC_HIDE_ZOOM_CONTROLS'])}
            </ChecklistRow>
            <ChecklistRow
              title="Show taken at time"
              status={showTakenAtTimeHidden}
              optional
            >
              Set environment variable to {'"1"'} to hide
              taken at time from photo meta:
              {renderEnvVars(['NEXT_PUBLIC_HIDE_TAKEN_AT_TIME'])}
            </ChecklistRow>
            <ChecklistRow
              title="Show social"
              status={showSocial}
              optional
            >
              Set environment variable to {'"1"'} to hide
              {' '}
              X (formerly Twitter) button from share modal:
              {renderEnvVars(['NEXT_PUBLIC_HIDE_SOCIAL'])}
            </ChecklistRow>
            <ChecklistRow
              title="Show Fujifilm simulations"
              status={showFilmSimulations}
              optional
            >
              Set environment variable to {'"1"'} to prevent
              simulations showing up in /grid sidebar and
              CMD-K results:
              {renderEnvVars(['NEXT_PUBLIC_HIDE_FILM_SIMULATIONS'])}
            </ChecklistRow>
            <ChecklistRow
              title="Show repo link"
              status={showRepoLink}
              optional
            >
              Set environment variable to {'"1"'} to hide footer link:
              {renderEnvVars(['NEXT_PUBLIC_HIDE_REPO_LINK'])}
            </ChecklistRow>
          </Checklist>
          <Checklist
            title="Grid"
            icon={<IoMdGrid size={17} />}
            optional
          >
            <ChecklistRow
              title="Grid homepage"
              status={isGridHomepageEnabled}
              optional
            >
              Set environment variable to {'"1"'} to show grid layout
              on homepage:
              {renderEnvVars(['NEXT_PUBLIC_GRID_HOMEPAGE'])}
            </ChecklistRow>
            <ChecklistRow
              title={`Grid aspect ratio: ${gridAspectRatio}`}
              status={hasGridAspectRatio}
              optional
            >
              Set environment variable to any number to enforce aspect ratio
              {' '}
              (default is {'"1"'}, i.e., square)—set to {'"0"'} to disable:
              {renderEnvVars(['NEXT_PUBLIC_GRID_ASPECT_RATIO'])}
            </ChecklistRow>
            <ChecklistRow
              title={`Grid density: ${gridDensity ? 'low' : 'high'}`}
              status={hasGridDensityPreference}
              optional
            >
              Set environment variable to {'"1"'} to ensure large thumbnails
              on photo grid views (if not configured, density is based on
              aspect ratio):
              {renderEnvVars(['NEXT_PUBLIC_SHOW_LARGE_THUMBNAILS'])}
            </ChecklistRow>
          </Checklist>
          <Checklist
            title="Settings"
            icon={<BiCog size={16} />}
            optional
          >
            <ChecklistRow
              title="Geo privacy"
              status={isGeoPrivacyEnabled}
              optional
            >
              Set environment variable to {'"1"'} to disable
              collection/display of location-based data:
              {renderEnvVars(['NEXT_PUBLIC_GEO_PRIVACY'])}
            </ChecklistRow>
            <ChecklistRow
              title="Public downloads"
              status={arePublicDownloadsEnabled}
              optional
            >
              Set environment variable to {'"1"'} to enable
              public photo downloads for all visitors:
              {renderEnvVars(['NEXT_PUBLIC_ALLOW_PUBLIC_DOWNLOADS'])}
            </ChecklistRow>
            <ChecklistRow
              title="Public API"
              status={isPublicApiEnabled}
              optional
            >
              Set environment variable to {'"1"'} to enable
              a public API available at <code>/api</code>:
              {renderEnvVars(['NEXT_PUBLIC_PUBLIC_API'])}
            </ChecklistRow>
            <ChecklistRow
              title="Priority order"
              status={isPriorityOrderEnabled}
              optional
            >
              Set environment variable to {'"1"'} to prevent
              priority order photo field affecting photo order:
              {renderEnvVars(['NEXT_PUBLIC_IGNORE_PRIORITY_ORDER'])}
            </ChecklistRow>
            <ChecklistRow
              title="Legacy OG text alignment"
              status={isOgTextBottomAligned}
              optional
            >
              Set environment variable to {'"BOTTOM"'} to
              keep OG image text bottom aligned (default is {'"top"'}):
              {renderEnvVars(['NEXT_PUBLIC_OG_TEXT_ALIGNMENT'])}
            </ChecklistRow>
          </Checklist>
          {areInternalToolsEnabled &&
            <Checklist
              title="Internal"
              icon={<CgDebug size={16} />}
              optional
            >
              <ChecklistRow
                title="Debug tools"
                status={areAdminDebugToolsEnabled}
                optional
              >
                Set environment variable to {'"1"'} to temporarily enable
                features like photo matting, baseline grid, etc.:
                {renderEnvVars(['ADMIN_DEBUG_TOOLS'])}
              </ChecklistRow>
              <ChecklistRow
                title="DB optimize"
                status={isAdminDbOptimizeEnabled}
                optional
              >
                Set environment variable to {'"1"'} to prevent
                homepages from seeding infinite scroll on load:
                {renderEnvVars(['ADMIN_DB_OPTIMIZE'])}
              </ChecklistRow>
              <ChecklistRow
                title="SQL debugging"
                status={isAdminSqlDebugEnabled}
                optional
              >
                Set environment variable to {'"1"'} to enable
                console output for all sql queries:
                {renderEnvVars(['ADMIN_SQL_DEBUG'])}
              </ChecklistRow>
            </Checklist>}
        </>}
      </div>
      <div className="pl-11 pr-2 sm:pr-11 mt-4 md:mt-7">
        <div>
          Changes to environment variables require a redeploy
          or reboot of local dev server
        </div>
        {!simplifiedView &&
          <div className="text-dim before:content-['—']">
            <div className="flex whitespace-nowrap">
              <span className="font-bold">Domain</span>
              &nbsp;&nbsp;
              <span className="w-full flex overflow-x-auto">
                {baseUrl || 'Not Defined'}
              </span>
            </div>
            <div>
              <span className="font-bold">Commit</span>
              &nbsp;&nbsp;
              {commitSha
                ? commitUrl
                  ? <Link
                    title={commitMessage}
                    href={commitUrl}
                    target="_blank"
                  >
                    {commitSha}
                  </Link>
                  : <span title={commitMessage}>{commitSha}</span>
                : 'Not Found'}
            </div>
          </div>}
      </div>
    </div>
  );
}
