import { BrandMark } from "@/components/brand-mark";
import { SkeletonBlock, SkeletonRegion } from "@/components/ui/skeleton";

function LoginBrandSkeleton() {
  return (
    <section className="login-brand-panel" aria-hidden="true">
      <div className="login-brand-content">
        <div className="flex items-center gap-4">
          <span className="workspace-brand-mark">
            <BrandMark size={36} />
          </span>
          <span className="login-skeleton-brand-copy">
            <SkeletonBlock className="login-skeleton-brand-name" />
            <SkeletonBlock className="login-skeleton-brand-caption" />
          </span>
        </div>
        <div className="login-brand-statement">
          <SkeletonBlock className="login-skeleton-eyebrow" />
          <span className="login-skeleton-headline">
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock className="login-skeleton-headline-short" />
          </span>
          <span className="login-skeleton-intro-copy">
            <SkeletonBlock />
            <SkeletonBlock className="login-skeleton-intro-copy-short" />
          </span>
          <div className="login-skeleton-steps">
            {[0, 1, 2].map((step) => (
              <div className="login-skeleton-step" key={step}>
                <SkeletonBlock className="login-skeleton-step-index" />
                <span>
                  <SkeletonBlock className="login-skeleton-step-title" />
                  <SkeletonBlock className="login-skeleton-step-copy" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LoginFormSkeleton() {
  return (
    <section className="login-form-panel" aria-hidden="true">
      <div className="login-card login-card-skeleton">
        <div className="login-mobile-brand mb-8 flex items-center gap-3 lg:hidden">
          <span className="workspace-user-avatar size-12">
            <BrandMark size={32} />
          </span>
          <span className="login-skeleton-mobile-brand-copy">
            <SkeletonBlock className="login-skeleton-mobile-brand-name" />
            <SkeletonBlock className="login-skeleton-mobile-brand-caption" />
          </span>
        </div>
        <div className="login-form-intro">
          <div className="login-form-kicker">
            <span className="login-form-mark">
              <BrandMark size={28} />
            </span>
            <SkeletonBlock className="login-skeleton-form-kicker" />
          </div>
          <div className="login-skeleton-form-heading">
            <SkeletonBlock />
            <SkeletonBlock className="login-skeleton-form-heading-short" />
          </div>
          <div className="login-skeleton-form-description">
            <SkeletonBlock />
            <SkeletonBlock className="login-skeleton-form-description-short" />
          </div>
        </div>

        <div className="login-skeleton-fields">
          {[0, 1].map((field) => (
            <div className="login-skeleton-field" key={field}>
              <SkeletonBlock className="login-skeleton-field-label" />
              <div className="login-skeleton-input">
                <SkeletonBlock className="login-skeleton-input-copy" />
                {field === 1 ? (
                  <SkeletonBlock className="login-skeleton-password-icon" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <SkeletonBlock className="login-skeleton-submit" />
        <div className="login-skeleton-help">
          <span>
            <SkeletonBlock className="login-skeleton-help-icon" />
            <SkeletonBlock className="login-skeleton-help-copy" />
          </span>
        </div>
      </div>
    </section>
  );
}

export function LoginPageSkeleton() {
  return (
    <SkeletonRegion label="Menyiapkan halaman masuk" className="login-skeleton-region">
      <main className="login-canvas login-canvas-skeleton">
        <LoginBrandSkeleton />
        <LoginFormSkeleton />
      </main>
    </SkeletonRegion>
  );
}
