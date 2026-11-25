import { expect, test, type Page } from "@playwright/test";

const schoolProfile = {
  success: true,
  message: "OK",
  data: {
    school_name: "Sekolah Uji Citra Negara",
    motto: "Belajar dengan aman.",
    contact_email: "",
    support_message: "Bantuan akun tersedia melalui administrator.",
  },
};

async function prepareUnauthenticatedPage(page: Page) {
  await page.route("**/api/v1/school-profile", (route) =>
    route.fulfill({ status: 200, json: schoolProfile }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({
      status: 401,
      json: { success: false, message: "No active test session." },
    }),
  );
}

function sessionEnvelope(mustChangePassword: boolean) {
  const now = "2026-01-01T00:00:00Z";
  return {
    success: true,
    message: "OK",
    data: {
      access_token: "synthetic-e2e-access-token",
      expires_in: 3600,
      user: {
        id: "synthetic-e2e-user",
        identifier: "e2e.student",
        full_name: "Siswa Uji",
        role: "student",
        status: "active",
        must_change_password: mustChangePassword,
        created_at: now,
        updated_at: now,
      },
    },
  };
}

test.beforeEach(async ({ page }) => {
  await prepareUnauthenticatedPage(page);
});
test("redirects an unauthenticated visitor from protected pages to login", async ({
  page,
}) => {
  await page.goto("/student/materials");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page).toHaveTitle("Masuk | Citra Negara LMS");
  await expect(
    page.getByRole("heading", { name: "Selamat Datang!" }),
  ).toBeVisible();
});

test("keeps the signed-in page open when token refresh hits a temporary server error", async ({
  page,
}) => {
  let refreshCalls = 0;
  await page.route("**/api/v1/auth/refresh", (route) => {
    refreshCalls += 1;
    return route.fulfill(
      refreshCalls === 1
        ? { json: sessionEnvelope(false) }
        : {
            status: 503,
            json: { success: false, message: "Synthetic temporary outage." },
          },
    );
  });
  await page.route(/\/api\/v1\/materials(?:\?|$)/, (route) =>
    route.fulfill({
      status: 401,
      json: { success: false, message: "Expired access token." },
    }),
  );

  await page.goto("/student/materials");

  await expect(page).toHaveURL(/\/student\/materials$/);
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Materi belum dapat dimuat." }),
  ).toBeVisible();
  await expect(page.getByText(/Synthetic temporary outage/)).toHaveCount(0);
  expect(refreshCalls).toBe(2);
});

test("shows a safe message when login fails", async ({ page }) => {
  let refreshCalls = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith("/auth/refresh")) {
      refreshCalls++;
    }
  });
  await page.route("**/api/v1/auth/login", (route) =>
    route.fulfill({
      status: 401,
      json: {
        success: false,
        message: "Synthetic backend diagnostic that must stay private.",
      },
    }),
  );

  await page.goto("/login");
  await page.getByLabel("Identitas").fill("invalid.e2e.user");
  await page
    .getByPlaceholder("Masukkan kata sandi akun Anda")
    .fill("synthetic-invalid-password");
  await page.getByRole("button", { name: "Masuk ke LMS" }).click();

  await expect(page.locator("form [role=alert]")).toHaveText(
    "Identitas atau kata sandi tidak valid.",
  );
  await expect(page.getByText(/Synthetic backend diagnostic/)).toHaveCount(0);
  expect(refreshCalls).toBe(1);
});

test("requires matching password confirmation before submitting a password change", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/login", (route) =>
    route.fulfill({ status: 200, json: sessionEnvelope(true) }),
  );
  let passwordChangeRequests = 0;
  await page.route("**/api/v1/auth/change-password", (route) => {
    passwordChangeRequests += 1;
    return route.fulfill({
      status: 200,
      json: { success: true, message: "OK", data: null },
    });
  });

  await page.goto("/login");
  await page.getByLabel("Identitas").fill("e2e.student");
  await page
    .getByPlaceholder("Masukkan kata sandi akun Anda")
    .fill("synthetic-current-password");
  await page.getByRole("button", { name: "Masuk ke LMS" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Perbarui kata sandi" }),
  ).toBeVisible();

  await page
    .getByLabel("Kata sandi saat ini", { exact: true })
    .fill("synthetic-current-password");
  await page
    .getByLabel("Kata sandi baru", { exact: true })
    .fill("synthetic-new-password");
  await page
    .getByLabel("Ulangi kata sandi baru", { exact: true })
    .fill("synthetic-other-password");
  await page.getByRole("button", { name: "Perbarui kata sandi" }).click();

  await expect(page.locator("form [role=alert]")).toHaveText(
    "Konfirmasi kata sandi belum sama.",
  );
  const confirmation = page.getByLabel("Ulangi kata sandi baru", { exact: true });
  await expect(confirmation).toBeFocused();
  await expect(confirmation).toHaveAccessibleDescription("Konfirmasi kata sandi belum sama.");
  expect(passwordChangeRequests).toBe(0);

  await page
    .getByLabel("Ulangi kata sandi baru", { exact: true })
    .fill("synthetic-new-password");
  await page.getByRole("button", { name: "Perbarui kata sandi" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator("form [role=alert]")).toContainText(
    "Kata sandi berhasil diperbarui.",
  );
  expect(passwordChangeRequests).toBe(1);
});

test("keeps wide result tables scrollable by keyboard on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ json: sessionEnvelope(false) }),
  );
  await page.route(/\/api\/v1\/student\/results(?:\?|$)/, (route) =>
    route.fulfill({
      json: {
        success: true,
        meta: { page: 1, per_page: 20, total: 1, total_pages: 1 },
        data: [{
          id: "synthetic-result",
          exam_title: "Ujian praktik pemrograman web",
          course_name: "Pemrograman Web",
          percentage: 85,
          score: 85,
          max_score: 100,
          graded_at: "2026-11-18T02:00:00Z",
        }],
      },
    }),
  );
  await page.goto("/student/results");
  await expect(page).toHaveTitle("Hasil ujian · Siswa | Citra Negara LMS");
  const name = "Hasil ujian yang telah dipublikasikan guru";
  const viewport = page.getByRole("region", { name });
  await expect(viewport.getByRole("table", { name })).toBeVisible();
  await expect(page.getByText("Gulir ke samping untuk melihat kolom lainnya.")).toBeVisible();
  await viewport.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test("announces exam time and keeps question navigation usable by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ json: sessionEnvelope(false) }),
  );
  await page.route("**/api/v1/student/attempts/synthetic-attempt", (route) =>
    route.fulfill({
      json: {
        success: true,
        data: {
          attempt_id: "synthetic-attempt",
          status: "in_progress",
          allow_back_navigation: true,
          server_time: "2026-11-18T02:00:00Z",
          deadline_at: "2026-11-18T02:04:00Z",
          questions: [
            { id: "first", stem: "Soal pertama", points: 1, options: [{ id: "a", content: "Jawaban pertama" }] },
            { id: "second", stem: "Soal kedua", points: 1, options: [{ id: "b", content: "Jawaban kedua" }] },
          ],
          answers: [{ exam_question_id: "first", selected_option_id: "a" }],
        },
      },
    }),
  );
  await page.goto("/student/attempts/synthetic-attempt");
  await expect(page.getByRole("status").filter({ hasText: "Waktu ujian tersisa lima menit atau kurang." })).toBeAttached();
  await expect(page.getByRole("button", { name: "Buka soal 1, sudah dijawab" })).toHaveAttribute("aria-current", "step");
  await expect(page.getByText("Tanda centang berarti soal sudah dijawab.")).toBeVisible();
  await page.getByRole("button", { name: "Berikutnya" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Soal kedua" })).toBeFocused();
  await expect(page.getByRole("radio", { name: "Jawaban kedua" })).toBeVisible();
});

test("lets a teacher choose an exam date with the keyboard inside the form dialog", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  const session = sessionEnvelope(false);
  session.data.user.role = "teacher";
  await page.route("**/api/v1/auth/refresh", (route) => route.fulfill({ json: session }));
  await page.route(/\/api\/v1\/(?:courses|exams)(?:\?|$)/, (route) =>
    route.fulfill({
      json: { success: true, data: [], meta: { page: 1, per_page: 20, total: 0, total_pages: 1 } },
    }),
  );
  await page.goto("/teacher/exams");
  await page.getByRole("button", { name: "Buat ujian" }).click();
  const trigger = page.getByRole("button", { name: /^Mulai ujian · WIB,/ });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("grid")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ke bulan berikutnya" })).toBeVisible();
  await expect(page.getByRole("gridcell").filter({ has: page.locator("button:focus") })).toHaveCount(1);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAccessibleName(/^Mulai ujian · WIB, \d/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("grid")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("keeps the login form usable without horizontal overflow on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");

  await expect(
    page.getByRole("button", { name: "Masuk ke LMS" }),
  ).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

async function loginAsPrincipal(page: Page) {
  const session = sessionEnvelope(false);
  session.data.user.role = "principal";
  session.data.user.full_name = "Kepala Sekolah Uji";
  await page.route("**/api/v1/auth/login", (route) => route.fulfill({ status: 200, json: session }));
  await page.route("**/api/v1/governance/overview", (route) => route.fulfill({ status: 200, json: { success: true, message: "OK", data: { generated_at: "2026-01-01T00:00:00Z", roles: [], courses: 0, classes: 0, active_attempts: 0, pending_requests: 0, draft_results: 0, exams: [], exam_states: [], quality: [], agenda: [] } } }));
  await page.goto("/login");
  await page.getByLabel("Identitas").fill("principal.test");
  await page.getByPlaceholder("Masukkan kata sandi akun Anda").fill("synthetic-password");
  await page.getByRole("button", { name: "Masuk ke LMS" }).click();
  await expect(page.getByRole("heading", { name: "Kepemimpinan sekolah" })).toBeVisible();
}

test("opens the principal control center with collapsible desktop navigation", async ({ page }) => {
  await loginAsPrincipal(page);
  await expect(page.getByRole("link", { name: /Laporan sekolah/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Tindak lanjut sekolah/ })).toBeVisible();
  await page.getByRole("button", { name: "Sembunyikan navigasi" }).click();
  await expect(page.getByRole("link", { name: /Laporan sekolah/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Tampilkan navigasi" }).click();
  await expect(page.getByRole("link", { name: /Laporan sekolah/ })).toBeVisible();
});

test("keeps keyboard focus within mobile navigation and returns it after closing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAsPrincipal(page);
  const toggle = page.getByRole("button", { name: "Tampilkan navigasi" });
  await toggle.click();

  const drawer = page.getByRole("dialog", { name: "Navigasi aplikasi" });
  const firstLink = drawer.getByRole("link").first();
  await expect(firstLink).toBeFocused();
  await expect(page.locator(".workspace-main")).toHaveJSProperty("inert", true);
  await page.keyboard.press("Shift+Tab");
  await expect(drawer.getByRole("button", { name: "Keluar" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(firstLink).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(toggle).toBeFocused();

  await toggle.press("Enter");
  await drawer.getByRole("button", { name: "Tutup navigasi" }).click();
  await expect(drawer).toHaveCount(0);
  await expect(toggle).toBeFocused();
});

test("restores a student session and cancels an image preview when leaving its material", async ({ page }) => {
  const session = sessionEnvelope(false);
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ json: session }),
  );
  const meta = { page: 1, per_page: 20, total: 2, total_pages: 1 };
  await page.route(/\/api\/v1\/courses\?/, (route) =>
    route.fulfill({ json: { success: true, data: [], meta } }),
  );
  const material = {
    course_id: "synthetic-course",
    course_name: "Course Uji",
    content: "Konten uji.",
    description: "Deskripsi uji.",
    status: "published",
  };
  await page.route(/\/api\/v1\/materials\?/, (route) =>
    route.fulfill({
      json: {
        success: true,
        meta,
        data: [
          {
            ...material,
            id: "synthetic-first",
            title: "Materi dengan gambar",
            position: 1,
            attachments: [
              { id: "synthetic-image", file_name: "uji.png", content_type: "image/png", size_bytes: 64 },
            ],
          },
          {
            ...material,
            id: "synthetic-second",
            title: "Materi berikutnya",
            position: 2,
            attachments: [],
          },
        ],
      },
    }),
  );
  const imagePath = "**/api/v1/materials/synthetic-first/attachments/synthetic-image";
  const pendingPreview = Promise.withResolvers<void>();
  await page.route(imagePath, async (route) => {
    await pendingPreview.promise;
    await route.abort().catch(() => undefined);
  });

  try {
    const previewStarted = page.waitForRequest(imagePath);
    await page.goto("/student/materials");
    await previewStarted;
    const previewCancelled = page.waitForEvent("requestfailed", {
      predicate: (request) => request.url().endsWith("/attachments/synthetic-image"),
    });
    await page.getByRole("button", { name: /Materi berikutnya/ }).click();
    const cancelled = await previewCancelled;
    expect(cancelled.failure()?.errorText).toMatch(/abort/i);
    await expect(page.getByRole("heading", { name: "Materi berikutnya" })).toBeFocused();
    await expect(page.getByText("Lampiran belum dapat dimuat.")).toHaveCount(0);
  } finally {
    pendingPreview.resolve();
  }
});
