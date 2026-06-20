(function () {
  const shellConfig = window.OAKLYN_LANGUAGE_SHELL;
  if (shellConfig) {
    const params = new URLSearchParams(window.location.search);
    const validLanguages = new Set(["en", "ar"]);
    const storageKey = shellConfig.storageKey || "oaklyn_lang_pref_raw_district";
    const actions = document.getElementById("languageShellActions");
    const loading = document.getElementById("languageShellLoading");

    function readCookie(name) {
      return document.cookie
        .split(";")
        .map(function (part) {
          return part.trim();
        })
        .filter(Boolean)
        .reduce(function (value, part) {
          if (value) return value;
          const prefix = name + "=";
          return part.indexOf(prefix) === 0 ? decodeURIComponent(part.slice(prefix.length)) : "";
        }, "");
    }

    function saveLanguage(lang) {
      if (!validLanguages.has(lang)) return;
      try {
        window.localStorage.setItem(storageKey, lang);
      } catch (error) {}
      document.cookie = storageKey + "=" + encodeURIComponent(lang) + "; path=/; max-age=31536000; SameSite=Lax";
    }

    function getInitialLanguage() {
      const queryLang = String(params.get("lang") || "").trim().toLowerCase();
      if (validLanguages.has(queryLang)) return queryLang;

      try {
        const storedLang = String(window.localStorage.getItem(storageKey) || "").trim().toLowerCase();
        if (validLanguages.has(storedLang)) return storedLang;
      } catch (error) {}

      const cookieLang = String(readCookie(storageKey) || "").trim().toLowerCase();
      if (validLanguages.has(cookieLang)) return cookieLang;

      return "";
    }

    function getTargetUrlWithCurrentQuery(targetUrl, lang) {
      const nextUrl = new URL(targetUrl, window.location.origin);
      params.forEach(function (value, key) {
        if (key === "lang") return;
        if (!nextUrl.searchParams.has(key)) {
          nextUrl.searchParams.set(key, value);
        }
      });
      nextUrl.searchParams.set("lang", lang || "");
      return nextUrl.pathname + nextUrl.search + nextUrl.hash;
    }

    async function loadLanguage(lang) {
      if (!validLanguages.has(lang)) return;
      const targetUrl = shellConfig.routeByLanguage && shellConfig.routeByLanguage[lang];
      if (!targetUrl) return;
      const fallbackUrl = getTargetUrlWithCurrentQuery(targetUrl, lang);

      saveLanguage(lang);

      if (actions) actions.hidden = true;
      if (loading) loading.hidden = false;

      const fallbackTimer = window.setTimeout(function () {
        window.location.href = fallbackUrl;
      }, 2500);

      try {
        const response = await fetch(targetUrl, {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin"
        });

        if (!response.ok) {
          throw new Error("Failed to load language page.");
        }

        const html = await response.text();
        window.clearTimeout(fallbackTimer);
        document.open();
        document.write(html);
        document.close();
      } catch (error) {
        window.clearTimeout(fallbackTimer);
        console.error("Language shell load error:", error);
        window.location.href = fallbackUrl;
      }
    }

    const initialLanguage = getInitialLanguage();
    if (initialLanguage) {
      loadLanguage(initialLanguage);
      return;
    }

    if (actions) {
      actions.querySelectorAll("[data-language-choice]").forEach(function (button) {
        button.addEventListener("click", function (event) {
          const targetLanguage = String(button.getAttribute("data-language-choice") || "").trim().toLowerCase();
          if (validLanguages.has(targetLanguage)) {
            event.preventDefault();
            loadLanguage(targetLanguage);
          }
        });
      });
    }

    return;
  }

  const config = window.OAKLYN_LANDING_CONFIG;
  if (!config) return;

  const landingLanguageParams = new URLSearchParams(window.location.search);
  const landingValidLanguages = new Set(["en", "ar"]);
  const languagePreferenceKey = config.language_preference_key || "oaklyn_lang_pref_raw_district";

  function readLandingCookie(name) {
    return document.cookie
      .split(";")
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean)
      .reduce(function (value, part) {
        if (value) return value;
        const prefix = name + "=";
        return part.indexOf(prefix) === 0 ? decodeURIComponent(part.slice(prefix.length)) : "";
      }, "");
  }

  function saveLandingLanguage(lang) {
    if (!landingValidLanguages.has(lang)) return;
    try {
      window.localStorage.setItem(languagePreferenceKey, lang);
    } catch (error) {}
    document.cookie = languagePreferenceKey + "=" + encodeURIComponent(lang) + "; path=/; max-age=31536000; SameSite=Lax";
  }

  function getStoredLandingLanguage() {
    try {
      const storedLang = String(window.localStorage.getItem(languagePreferenceKey) || "").trim().toLowerCase();
      if (landingValidLanguages.has(storedLang)) return storedLang;
    } catch (error) {}

    const cookieLang = String(readLandingCookie(languagePreferenceKey) || "").trim().toLowerCase();
    return landingValidLanguages.has(cookieLang) ? cookieLang : "";
  }

  function getLandingLanguageRoute(targetUrl, lang) {
    const nextUrl = new URL(targetUrl, window.location.origin);
    landingLanguageParams.forEach(function (value, key) {
      if (key === "lang") return;
      if (!nextUrl.searchParams.has(key)) {
        nextUrl.searchParams.set(key, value);
      }
    });
    nextUrl.searchParams.set("lang", lang || "");
    return nextUrl.pathname + nextUrl.search + nextUrl.hash;
  }

  async function loadLandingLanguage(lang, elements) {
    if (!landingValidLanguages.has(lang)) return;
    const targetUrl = config.language_routes && config.language_routes[lang];
    if (!targetUrl) return;
    const fallbackUrl = getLandingLanguageRoute(targetUrl, lang);

    saveLandingLanguage(lang);

    if (elements && elements.actions) elements.actions.hidden = true;
    if (elements && elements.loading) elements.loading.hidden = false;

    const fallbackTimer = window.setTimeout(function () {
      window.location.href = fallbackUrl;
    }, 2500);

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin"
      });

      if (!response.ok) {
        throw new Error("Failed to load selected language.");
      }

      const html = await response.text();
      window.clearTimeout(fallbackTimer);
      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      window.clearTimeout(fallbackTimer);
      console.error("Landing language load error:", error);
      window.location.href = fallbackUrl;
    }
  }

  function setupLandingLanguageExperience() {
    const currentLanguage = String(config.current_language || "").trim().toLowerCase();
    const queryLanguage = String(landingLanguageParams.get("lang") || "").trim().toLowerCase();
    const forceLanguagePrompt = ["1", "true", "yes"].includes(
      String(landingLanguageParams.get("choose_language") || "").trim().toLowerCase()
    );
    const storedLanguage = getStoredLandingLanguage();
    const overlay = document.querySelector("[data-language-choice-overlay]");
    const actions = overlay ? overlay.querySelector("#languageChoiceActions") : null;
    const loading = overlay ? overlay.querySelector("[data-language-choice-loading]") : null;
    const overlayElements = { actions: actions, loading: loading };

    if (landingValidLanguages.has(queryLanguage)) {
      saveLandingLanguage(queryLanguage);
      if (queryLanguage !== currentLanguage) {
        loadLandingLanguage(queryLanguage, overlayElements);
        return true;
      }
    } else if (!forceLanguagePrompt && storedLanguage && storedLanguage !== currentLanguage) {
      loadLandingLanguage(storedLanguage, overlayElements);
      return true;
    }

    if (overlay) {
      const shouldShowOverlay = Boolean(config.language_prompt_enabled && !queryLanguage && (forceLanguagePrompt || !storedLanguage));
      overlay.hidden = !shouldShowOverlay;
      overlay.setAttribute("aria-hidden", String(!shouldShowOverlay));
      document.body.classList.toggle("language-modal-open", shouldShowOverlay);

      overlay.querySelectorAll("[data-language-choice]").forEach(function (choice) {
        choice.addEventListener("click", function (event) {
          const targetLanguage = String(choice.getAttribute("data-language-choice") || "").trim().toLowerCase();
          if (!landingValidLanguages.has(targetLanguage)) return;

          event.preventDefault();
          saveLandingLanguage(targetLanguage);

          if (targetLanguage === currentLanguage) {
            overlay.hidden = true;
            overlay.setAttribute("aria-hidden", "true");
            document.body.classList.remove("language-modal-open");
            return;
          }

          loadLandingLanguage(targetLanguage, overlayElements);
        });
      });
    }

    return false;
  }

  if (setupLandingLanguageExperience()) return;

  const menuButton = document.querySelector("[data-mobile-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("click", function (event) {
    const link = event.target && event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", hash);
    }
  });

  const heroSlider = document.querySelector("[data-hero-slider]");
  if (heroSlider) {
    const heroSlides = Array.from(heroSlider.querySelectorAll(".hero-slide"));
    let heroIndex = 0;

    function setHeroSlide(index) {
      if (!heroSlides.length) return;
      heroIndex = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach(function (slide, slideIndex) {
        const active = slideIndex === heroIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
    }

    setHeroSlide(0);
    if (heroSlides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setInterval(function () {
        setHeroSlide(heroIndex + 1);
      }, 5200);
    }
  }

  const carousel = document.querySelector("[data-gallery]");
  if (carousel) {
    const track = carousel.querySelector("[data-gallery-track]");
    const dots = Array.from(document.querySelectorAll("[data-gallery-dot]"));
    const slides = Array.from(carousel.querySelectorAll("[data-gallery-slide]"));
    const prev = document.querySelector("[data-gallery-prev]");
    const next = document.querySelector("[data-gallery-next]");
    const progressBar = carousel.querySelector("[data-gallery-progress]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const autoSlideDuration = 6800;
    let activeIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let autoTimer = null;
    if (track) {
      track.style.direction = "ltr";
    }

    function setSlide(index) {
      if (!track || !slides.length) return;
      activeIndex = (index + slides.length) % slides.length;
      [activeIndex, (activeIndex + 1) % slides.length].forEach(function (slideIndex) {
        const image = slides[slideIndex]?.querySelector(".gallery-photo");
        if (image && image.loading === "lazy") {
          image.loading = "eager";
        }
      });
      track.style.transform = "translate3d(" + activeIndex * -100 + "%, 0, 0)";
      slides.forEach(function (slide, slideIndex) {
        const active = slideIndex === activeIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach(function (dot, dotIndex) {
        const active = dotIndex === activeIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-pressed", String(active));
      });
      if (progressBar) {
        progressBar.style.animation = "none";
        progressBar.style.width = "0%";
        if (!reducedMotion.matches && slides.length > 1) {
          void progressBar.offsetWidth;
          progressBar.style.animation = "galleryProgress " + autoSlideDuration + "ms linear forwards";
        }
      }
    }

    function stopAutoSlide() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAutoSlide() {
      if (slides.length < 2 || reducedMotion.matches) return;
      stopAutoSlide();
      autoTimer = window.setInterval(function () {
        setSlide(activeIndex + 1);
      }, autoSlideDuration);
    }

    function userSetSlide(index) {
      setSlide(index);
      startAutoSlide();
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        userSetSlide(index);
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        userSetSlide(activeIndex - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        userSetSlide(activeIndex + 1);
      });
    }

    carousel.addEventListener(
      "touchstart",
      function (event) {
        if (!event.touches || !event.touches.length) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches.length) return;
        const diffX = event.changedTouches[0].clientX - touchStartX;
        const diffY = event.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) < 42 || Math.abs(diffX) < Math.abs(diffY)) return;
        userSetSlide(activeIndex + (diffX < 0 ? 1 : -1));
      },
      { passive: true }
    );

    setSlide(0);
    startAutoSlide();
  }

  const params = new URLSearchParams(window.location.search);
  const clickIdStoragePrefix = "oaklyn_" + config.project_slug + "_click_id_";

  function captureClickId(paramName) {
    const valueFromUrl = params.get(paramName) || "";
    const storageKey = clickIdStoragePrefix + paramName;

    if (valueFromUrl) {
      try {
        window.localStorage.setItem(storageKey, valueFromUrl);
      } catch (error) {}
      return valueFromUrl;
    }

    try {
      return window.localStorage.getItem(storageKey) || "";
    } catch (error) {
      return "";
    }
  }

  const clickIds = {
    gclid: captureClickId("gclid"),
    gbraid: captureClickId("gbraid"),
    wbraid: captureClickId("wbraid"),
    fbclid: captureClickId("fbclid"),
    ttclid: captureClickId("ttclid"),
    ScCid: captureClickId("ScCid"),
    li_fat_id: captureClickId("li_fat_id"),
    rdt_cid: captureClickId("rdt_cid")
  };

  const utmData = {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    utm_platform: params.get("utm_platform") || "",
    utm_keyword: params.get("utm_keyword") || "",
    gad_source: params.get("gad_source") || "",
    gad_campaignid: params.get("gad_campaignid") || "",
    gad_adgroupid: params.get("gad_adgroupid") || "",
    gad_creative: params.get("gad_creative") || ""
  };

  const LANDING_PAGE_VARIANT = "arancia-yards-main";

  function firstPresentValue(values) {
    for (let index = 0; index < values.length; index += 1) {
      const value = String(values[index] || "").trim();
      if (value) return value;
    }
    return "";
  }

  function getCampaignName() {
    return firstPresentValue([
      params.get("campaign_name"),
      params.get("campaign"),
      utmData.utm_campaign,
      "Arancia Yards by BEYOND"
    ]);
  }

  function getCampaignSearchTerm() {
    return firstPresentValue([
      params.get("campaign_search_term"),
      params.get("search_term"),
      params.get("keyword"),
      params.get("query"),
      utmData.utm_term,
      utmData.utm_keyword
    ]);
  }

  function getLeadLanguage() {
    return firstPresentValue([
      config.current_language,
      document.documentElement ? document.documentElement.lang : "",
      navigator.language,
      "en"
    ]);
  }

  function getAdSystem() {
    const source = String(utmData.utm_source || "").toLowerCase();
    const medium = String(utmData.utm_medium || "").toLowerCase();
    const platform = String(utmData.utm_platform || "").toLowerCase();

    if (clickIds.gclid || clickIds.gbraid || clickIds.wbraid || source.includes("google") || platform.includes("google")) {
      return "Google Ads";
    }

    if (
      clickIds.fbclid ||
      source.includes("facebook") ||
      source.includes("instagram") ||
      source.includes("meta") ||
      platform.includes("meta")
    ) {
      return "Meta";
    }

    if (clickIds.ttclid || source.includes("tiktok") || platform.includes("tiktok")) return "TikTok";
    if (clickIds.ScCid || source.includes("snapchat") || platform.includes("snapchat")) return "Snapchat";
    if (clickIds.li_fat_id || source.includes("linkedin") || platform.includes("linkedin")) return "LinkedIn";
    if (clickIds.rdt_cid || source.includes("reddit") || platform.includes("reddit")) return "Reddit";
    if (medium === "organic") return "Organic";

    return utmData.utm_source || "Website";
  }

  function getTrackingMedium(adSystem) {
    return firstPresentValue([
      utmData.utm_medium,
      adSystem === "Google Ads" ? "cpc" : "",
      adSystem === "Meta" ? "paid_social" : "",
      "website"
    ]);
  }

  function buildSourceInformation(adSystem, medium, campaignName) {
    return [
      "Source: " + (utmData.utm_source || adSystem || "Website"),
      "Medium: " + (medium || "website"),
      "Campaign: " + (campaignName || "Arancia Yards by BEYOND"),
      "Content: " + (utmData.utm_content || ""),
      "Search term: " + getCampaignSearchTerm(),
      "Page: " + window.location.href
    ].join(" | ");
  }

  function buildCrmComment(details) {
    return [
      "Project: " + details.projectName,
      "Lead name: " + details.fullName,
      "Phone: " + details.phone,
      "Email: " + details.email,
      "Country: " + details.country,
      "Bedroom: " + details.bedroom,
      "Property type: " + details.propertyType,
      "Interested in: " + details.interestedIn,
      "Client comment: " + details.comment,
      "Source: " + details.sourceInformation,
      "GCLID: " + details.gclid,
      "FBCLID: " + details.fbclid,
      "UTM Source: " + details.utmSource,
      "UTM Medium: " + details.utmMedium,
      "UTM Campaign: " + details.utmCampaign,
      "UTM Content: " + details.utmContent,
      "UTM Term: " + details.utmTerm,
      "Campaign search term: " + details.campaignSearchTerm,
      "Property link: " + details.propertyLink,
      "WhatsApp link: " + details.whatsappLink,
      "Events ID: " + details.eventId
    ].join("\n");
  }

  function injectLanguageSwitcher() {
    if (!config.language_switcher_enabled || !config.landing_page_url || document.querySelector("[data-language-switcher]")) return;

    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.setAttribute("data-language-switcher", "true");
    switcher.innerHTML =
      '<button type="button" data-language-target="en">EN</button>' +
      '<button type="button" data-language-target="ar">AR</button>';

    switcher.querySelectorAll("button").forEach(function (button) {
      const targetLanguage = String(button.getAttribute("data-language-target") || "").trim().toLowerCase();
      const isActive = targetLanguage === String(config.current_language || "").trim().toLowerCase();

      button.classList.toggle("is-active", isActive);
      button.addEventListener("click", function () {
        if (!targetLanguage || isActive) return;

        try {
          window.localStorage.setItem(languagePreferenceKey, targetLanguage);
        } catch (error) {}

        document.cookie = languagePreferenceKey + "=" + encodeURIComponent(targetLanguage) + "; path=/; max-age=31536000; SameSite=Lax";

        const routeUrl =
          config.language_routes && config.language_routes[targetLanguage]
            ? config.language_routes[targetLanguage]
            : config.landing_page_url;
        const nextUrl = new URL(routeUrl, window.location.origin);
        if (!/\.html$/i.test(nextUrl.pathname)) {
          nextUrl.searchParams.set("lang", targetLanguage);
        }
        window.location.href = nextUrl.toString();
      });
    });

    document.body.appendChild(switcher);
  }

  injectLanguageSwitcher();

  function pushDataLayerEvent(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  function splitFullNameForMatching(fullName) {
    const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] || "",
      lastName: parts.length > 1 ? parts.slice(1).join(" ") : ""
    };
  }

  function buildLeadMatchData(payload) {
    const fullName = String(payload && (payload.full_name || payload.name) ? payload.full_name || payload.name : "").trim();
    const splitName = splitFullNameForMatching(fullName);
    const firstName = String(payload && payload.first_name ? payload.first_name : splitName.firstName).trim();
    const lastName = String(payload && payload.last_name ? payload.last_name : splitName.lastName).trim();
    const email = normalizeEmailValue(payload && payload.email ? payload.email : "");
    const phone = normalizePhone(payload && (payload.phone || payload.phone_number) ? payload.phone || payload.phone_number : "");
    const externalId = payload && payload.lead_id ? String(payload.lead_id) : "";

    return {
      email: email,
      phone: phone,
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      external_id: externalId,
      em: email,
      ph: phone,
      fn: firstName.toLowerCase(),
      ln: lastName.toLowerCase()
    };
  }

  function buildLeadMatchingTrackingFields(matchData) {
    const data = matchData || {};
    return {
      lead_email: data.email || "",
      lead_phone: data.phone || "",
      lead_full_name: data.full_name || "",
      lead_first_name: data.first_name || "",
      lead_last_name: data.last_name || "",
      external_id: data.external_id || "",
      meta_advanced_matching: {
        em: data.em || data.email || "",
        ph: data.ph || data.phone || "",
        fn: data.fn || "",
        ln: data.ln || "",
        external_id: data.external_id || ""
      }
    };
  }

  function setLeadMatchKeys(payload) {
    const matchData = buildLeadMatchData(payload || {});
    window._leadEmail = matchData.email;
    window._leadPhone = matchData.phone;
    window._leadFullName = matchData.full_name;
    window._leadFirstName = matchData.first_name;
    window._leadLastName = matchData.last_name;
    window._leadExternalId = matchData.external_id;
    window.oaklynLeadMatchData = matchData;
    return matchData;
  }

  function encodeWebhookPayload(payload) {
    const requestBody = new URLSearchParams();
    Object.keys(payload || {}).forEach(function (key) {
      const value = payload[key];
      requestBody.append(key, value == null ? "" : String(value));
    });
    return requestBody;
  }

  function validateWebhookLeadPayload(payload) {
    const fullName = String(payload && (payload.full_name || payload.name) ? payload.full_name || payload.name : "").trim();
    const phone = normalizePhone(payload && (payload.phone || payload.phone_number) ? payload.phone || payload.phone_number : "");
    const phoneCountryCode = String(payload && payload.phone_country_code ? payload.phone_country_code : "").trim();
    const email = normalizeEmailValue(payload && payload.email ? payload.email : "");
    const inquiry = String(payload && (payload.comments || payload.inquiry_message || payload.inquiry) ? payload.comments || payload.inquiry_message || payload.inquiry : "").trim();

    if (fullName.length < 2) return "full name is missing";
    if (!phoneCountryCode) return "country code is missing";
    if (!phone || phone.replace(/\D/g, "").length < 8) return "phone number is missing";
    if (!email || !isValidEmailValue(email)) return "email is invalid";
    if (inquiry.length < 2) return "comments are missing";

    return "";
  }

  function submitFormWebhook(payload) {
    const payloadError = validateWebhookLeadPayload(payload || {});

    if (payloadError) {
      pushDataLayerEvent({
        event: "lead_webhook_blocked_empty_payload",
        project: config.project_name,
        project_name: config.project_name,
        project_slug: config.project_slug,
        block_reason: payloadError
      });
      return Promise.reject(new Error("Blocked empty lead payload: " + payloadError));
    }

    if (!config.webhook_url) {
      return Promise.reject(new Error("Missing form webhook URL."));
    }

    return fetch(config.webhook_url, {
      method: "POST",
      body: encodeWebhookPayload(payload),
      keepalive: true
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Webhook response status " + response.status);
      }
      return response;
    });
  }

  function createLeadId() {
    return config.project_slug + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  }

  function normalizePhone(value) {
    const cleaned = String(value || "").replace(/[^\d+]/g, "");
    if (!cleaned) return "";
    if (cleaned.charAt(0) === "+") return cleaned;
    return "+" + cleaned.replace(/\D/g, "");
  }

  const verifiedWhatsAppUrl =
    "https://wa.me/971505886769?text=Hello%20Oaklyn%20Realty%2C%20I%20am%20interested%20in%20Arancia%20Yards%20by%20BEYOND";

  function resetVerificationOverlay() {
    const overlay = document.getElementById("verify-overlay");
    const shieldPath = document.getElementById("shield-path");
    const checkPath = document.getElementById("check-path");
    const headline = document.getElementById("verify-headline");
    const sub = document.getElementById("verify-sub");
    const bar = document.getElementById("verify-bar");
    const pct = document.getElementById("verify-pct");

    if (overlay) {
      overlay.style.opacity = "1";
      overlay.style.transition = "";
    }
    if (shieldPath) shieldPath.style.strokeDashoffset = "120";
    if (checkPath) checkPath.style.strokeDashoffset = "30";
    const configuredHeadlines =
      Array.isArray(config.verification_headlines) && config.verification_headlines.length
        ? config.verification_headlines
        : ["Verifying your information..."];
    const configuredSubs =
      Array.isArray(config.verification_subs) && config.verification_subs.length
        ? config.verification_subs
        : ["This usually takes a few seconds"];
    if (headline) {
      headline.textContent = configuredHeadlines[0];
      headline.style.opacity = "1";
    }
    if (sub) {
      sub.textContent = configuredSubs[0];
      sub.style.opacity = "1";
    }
    if (bar) bar.style.width = "0%";
    if (pct) pct.textContent = "0%";
  }

  function showVerification(onComplete) {
    const overlay = document.getElementById("verify-overlay");
    if (!overlay) {
      if (onComplete) onComplete();
      return;
    }

    resetVerificationOverlay();
    overlay.style.display = "flex";

    window.setTimeout(function () {
      const shieldPath = document.getElementById("shield-path");
      const checkPath = document.getElementById("check-path");
      if (shieldPath) shieldPath.style.strokeDashoffset = "0";
      if (checkPath) checkPath.style.strokeDashoffset = "0";
    }, 100);

    const headlines =
      Array.isArray(config.verification_headlines) && config.verification_headlines.length
        ? config.verification_headlines
        : [
            "Verifying your information...",
            "Checking availability...",
            "Securing your consultation slot...",
            "Connecting you with your advisor..."
          ];
    const subs =
      Array.isArray(config.verification_subs) && config.verification_subs.length
        ? config.verification_subs
        : [
            "This usually takes a few seconds",
            "Your data is encrypted and secure",
            "We never share your information",
            "Almost ready..."
          ];
    let headlineIndex = 0;
    const hInterval = window.setInterval(function () {
      headlineIndex += 1;
      if (headlineIndex < headlines.length) {
        const headline = document.getElementById("verify-headline");
        const sub = document.getElementById("verify-sub");
        if (!headline || !sub) return;
        headline.style.opacity = "0";
        sub.style.opacity = "0";
        window.setTimeout(function () {
          headline.textContent = headlines[headlineIndex];
          sub.textContent = subs[headlineIndex];
          headline.style.opacity = "1";
          sub.style.opacity = "1";
        }, 400);
      }
    }, 1400);

    const duration = 4500 + Math.random() * 1500;
    const start = Date.now();
    const bar = document.getElementById("verify-bar");
    const pct = document.getElementById("verify-pct");

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    const ticker = window.setInterval(function () {
      const elapsed = Date.now() - start;
      const raw = Math.min(elapsed / duration, 1);
      const eased = easeInOut(raw);
      const progress = Math.round(eased * 100);
      if (bar) bar.style.width = progress + "%";
      if (pct) pct.textContent = progress + "%";
      if (raw >= 1) {
        window.clearInterval(ticker);
        window.clearInterval(hInterval);
        window.setTimeout(function () {
          Promise.resolve()
            .then(function () {
              if (onComplete) return onComplete();
              return null;
            })
            .catch(function (error) {
              console.error("[verification] Completion failed", error);
            })
            .finally(function () {
              overlay.style.opacity = "0";
              overlay.style.transition = "opacity 0.4s";
              window.setTimeout(function () {
                overlay.style.display = "none";
                overlay.style.opacity = "1";
              }, 400);
            });
        }, 300);
      }
    }, 50);
  }

  function handleWhatsApp(event) {
    const target = event && event.currentTarget ? event.currentTarget : null;
    const destinationUrl =
      target && target.dataset
        ? String(target.dataset.whatsappDestination || target.getAttribute("href") || verifiedWhatsAppUrl)
        : verifiedWhatsAppUrl;
    const ctaLocation = target && target.dataset ? String(target.dataset.ctaLocation || "whatsapp_cta") : "whatsapp_cta";
    const ctaLabel =
      target && target.dataset
        ? String(target.dataset.ctaLabel || target.textContent || "WhatsApp").trim()
        : "WhatsApp";

    if (!window.__oaklynWhatsAppConversionTracked) {
      window.__oaklynWhatsAppConversionTracked = true;
      window.__oaklynWhatsAppConversionEventId =
        config.project_slug + "_whatsapp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
      pushDataLayerEvent(
        Object.assign(
          {
            event: "whatsapp_conversion",
            conversion_type: "whatsapp",
            project_name: config.project_name,
            project_slug: config.project_slug,
            source_page: config.source_page,
            landing_page_url: config.landing_page_url,
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            cta_type: "whatsapp",
            cta_label: ctaLabel,
            cta_location: ctaLocation,
            destination_url: destinationUrl,
            event_id: window.__oaklynWhatsAppConversionEventId,
            lead_id: window.__oaklynWhatsAppConversionEventId
          },
          clickIds,
          utmData
        )
      );
    }
  }

  function handleCall(event) {
    return true;
  }

  window.showVerification = showVerification;
  window.handleWhatsApp = handleWhatsApp;
  window.handleCall = handleCall;

  function normalizeDialCode(value) {
    const cleaned = String(value || "").replace(/[^\d+]/g, "");
    if (!cleaned) return "+971";
    return cleaned.charAt(0) === "+" ? cleaned : "+" + cleaned.replace(/\D/g, "");
  }

  function stripPhoneFormatting(value) {
    return String(value || "").replace(/[\s\-()]/g, "");
  }

  function digitsOnly(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function hasRepeatedDigits(value) {
    return /^(\d)\1+$/.test(String(value || ""));
  }

  function buildValidatedPhoneNumber(localValue, countryCode, allowedDialCodes) {
    const rawCountryCode = String(countryCode || "").trim();
    if (!rawCountryCode) {
      return { valid: false };
    }

    const normalizedCountryCode = normalizeDialCode(rawCountryCode);
    const rawLocalValue = String(localValue || "").trim();

    if (!normalizedCountryCode || !allowedDialCodes.has(normalizedCountryCode)) {
      return { valid: false };
    }

    if (!rawLocalValue || !/^[\d\s\-()]+$/.test(rawLocalValue)) {
      return { valid: false };
    }

    const normalizedLocalInput = stripPhoneFormatting(rawLocalValue);
    if (!/^\d+$/.test(normalizedLocalInput)) {
      return { valid: false };
    }

    const nationalNumber = normalizedLocalInput.charAt(0) === "0" ? normalizedLocalInput.slice(1) : normalizedLocalInput;
    if (!nationalNumber || nationalNumber.length < 6 || nationalNumber.length > 12) {
      return { valid: false };
    }

    if (hasRepeatedDigits(nationalNumber)) {
      return { valid: false };
    }

    const e164 = normalizePhone(normalizedCountryCode + nationalNumber);
    const e164Digits = e164.replace(/[^\d]/g, "");
    if (e164Digits.length < 8 || e164Digits.length > 15) {
      return { valid: false };
    }

    return {
      valid: true,
      countryCode: normalizedCountryCode,
      phoneLocal: normalizedLocalInput,
      nationalNumber,
      e164
    };
  }

  function buildSimilarPhoneCandidates(phoneValidation) {
    if (!phoneValidation || !phoneValidation.valid) return [];

    const candidates = [];
    const seen = new Set();

    function pushCandidate(value) {
      const normalized = String(value || "").trim();
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      candidates.push(normalized);
    }

    const e164 = normalizePhone(phoneValidation.e164 || "");
    const e164Digits = digitsOnly(e164);
    const countryDigits = digitsOnly(phoneValidation.countryCode || "");
    const nationalDigits = digitsOnly(phoneValidation.nationalNumber || "");
    const localDigits = digitsOnly(phoneValidation.phoneLocal || "");
    const localWithLeadingZero =
      nationalDigits && localDigits !== "0" + nationalDigits ? "0" + nationalDigits : "";

    pushCandidate(e164);
    pushCandidate(e164Digits);

    if (countryDigits && nationalDigits) {
      pushCandidate("+" + countryDigits + nationalDigits);
      pushCandidate(countryDigits + nationalDigits);
    }

    pushCandidate(localDigits);
    pushCandidate(nationalDigits);
    pushCandidate(localWithLeadingZero);

    return candidates;
  }

  function setError(field, hasError) {
    if (!field || !field.wrap || !field.input) return;
    field.wrap.classList.toggle("has-error", hasError);
    field.input.setAttribute("aria-invalid", hasError ? "true" : "false");
  }

  function focusFieldError(field) {
    if (!field || !field.wrap) return;
    const focusTarget = field.input || field.wrap.querySelector("input, select, textarea, button");

    field.wrap.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    window.setTimeout(function () {
      if (focusTarget && typeof focusTarget.focus === "function") {
        focusTarget.focus({
          preventScroll: true
        });
      }
    }, 180);
  }

  function buildThankYouUrl(leadId) {
    const thankYouUrl = new URL(config.thank_you_page_url);
    thankYouUrl.searchParams.set("lead", "success");
    thankYouUrl.searchParams.set("project", config.project_slug);
    thankYouUrl.searchParams.set("lead_id", leadId);
    if (config.current_language) {
      thankYouUrl.searchParams.set("lang", config.current_language);
    }

    Object.keys(clickIds).forEach(function (key) {
      if (clickIds[key]) thankYouUrl.searchParams.set(key, clickIds[key]);
    });

    Object.keys(utmData).forEach(function (key) {
      if (utmData[key]) thankYouUrl.searchParams.set(key, utmData[key]);
    });

    return thankYouUrl.toString();
  }

  function writeLeadSuccessState(leadId) {
    const storageKey = "oaklyn_" + config.project_slug + "_lead_success";
    const state = JSON.stringify({
      project_name: config.project_name,
      project_slug: config.project_slug,
      lead_id: leadId,
      timestamp: Date.now()
    });

    try {
      window.sessionStorage.setItem(storageKey, state);
    } catch (error) {}

    try {
      window.localStorage.setItem(storageKey, state);
    } catch (error) {}
  }

  function normalizeEmailValue(value) {
    return String(value || "").trim().toLowerCase();
  }

  const BLOCKED_EMAIL_DOMAINS = new Set([
    "10minutemail.com",
    "dispostable.com",
    "example.com",
    "fake.com",
    "guerrillamail.com",
    "mailinator.com",
    "sharklasers.com",
    "tempmail.com",
    "test.com",
    "yopmail.com"
  ]);

  const BLOCKED_EMAIL_LOCAL_PARTS = new Set([
    "a",
    "aa",
    "abc",
    "asdf",
    "fake",
    "na",
    "none",
    "null",
    "qwerty",
    "test",
    "testing",
    "user"
  ]);

  const COMMON_EMAIL_TYPOS = new Set([
    "gmal.com",
    "gmail.con",
    "gnail.com",
    "gmial.com",
    "hotmil.com",
    "hotnail.com",
    "outlook.con",
    "yaho.com",
    "yahoo.con"
  ]);

  function isValidEmailValue(value) {
    const email = normalizeEmailValue(value);
    if (email.length < 6 || email.length > 254) return false;
    if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(email)) return false;

    const parts = email.split("@");
    if (parts.length !== 2) return false;

    const localPart = parts[0];
    const domain = parts[1];
    if (!localPart || localPart.length > 64 || localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
      return false;
    }

    if (BLOCKED_EMAIL_LOCAL_PARTS.has(localPart) || /^test\d*$/i.test(localPart) || /^fake\d*$/i.test(localPart)) {
      return false;
    }

    if (!domain || domain.includes("..") || BLOCKED_EMAIL_DOMAINS.has(domain) || COMMON_EMAIL_TYPOS.has(domain)) {
      return false;
    }

    const domainLabels = domain.split(".");
    if (domainLabels.some((label) => !label || label.startsWith("-") || label.endsWith("-"))) {
      return false;
    }

    const topLevelDomain = domainLabels[domainLabels.length - 1] || "";
    return /^[a-z]{2,24}$/i.test(topLevelDomain);
  }

  function looksLikeHtmlDocument(value) {
    return /^\s*<(?:!doctype html|html)\b/i.test(String(value || ""));
  }

  const form = document.getElementById("landingLeadForm");
  if (!form) return;

  const honeypot = document.getElementById("landing_website");
  const submitBtn = document.getElementById("landingSubmitBtn");
  const defaultSubmitLabel = submitBtn ? submitBtn.textContent : "Submit";
  const formError = document.getElementById("landingFormError");
  const success = document.getElementById("landingSuccess");
  const gclidInput = document.getElementById("landing_gclid");
  const gbraidInput = document.getElementById("landing_gbraid");
  const wbraidInput = document.getElementById("landing_wbraid");
  const fbclidInput = document.getElementById("landing_fbclid");
  const ttclidInput = document.getElementById("landing_ttclid");
  const sccidInput = document.getElementById("landing_sccid");
  const liFatIdInput = document.getElementById("landing_li_fat_id");
  const rdtCidInput = document.getElementById("landing_rdt_cid");
  const leadIdInput = document.getElementById("landing_lead_id");
  const phoneCountryInput = document.getElementById("landing_phone_country");
  const countryPickers = Array.from(document.querySelectorAll("[data-country-picker]"));
  const countryOptions = Array.from(document.querySelectorAll("[data-country-option]"));
  const countryPickerControllers = new Map();
  const allowedPhoneCountryCodes = new Set(
    countryOptions
      .map(function (option) {
        return normalizeDialCode(option.dataset.countryCode || "");
      })
      .filter(Boolean)
  );

  function getSelectedCountryLabel(countryCode) {
    const normalizedCode = normalizeDialCode(countryCode || "");
    const selectedOption = countryOptions.find(function (option) {
      return normalizeDialCode(option.dataset.countryCode || "") === normalizedCode;
    });

    return selectedOption ? String(selectedOption.dataset.countryLabel || "").trim() : "";
  }

  if (gclidInput) gclidInput.value = clickIds.gclid;
  if (gbraidInput) gbraidInput.value = clickIds.gbraid;
  if (wbraidInput) wbraidInput.value = clickIds.wbraid;
  if (fbclidInput) fbclidInput.value = clickIds.fbclid;
  if (ttclidInput) ttclidInput.value = clickIds.ttclid;
  if (sccidInput) sccidInput.value = clickIds.ScCid;
  if (liFatIdInput) liFatIdInput.value = clickIds.li_fat_id;
  if (rdtCidInput) rdtCidInput.value = clickIds.rdt_cid;

  function setFormErrorMessage(message) {
    if (!formError) return;
    formError.textContent = message;
  }

  const normalizeCountrySearch = function (value) {
    return String(value || "").trim().toLowerCase().replace(/[^\da-z+]/g, "");
  };

  const normalizeCodeDigits = function (value) {
    return String(value || "").replace(/\D/g, "");
  };

  function setupCountryPicker(countryPicker) {
    const countryInput = countryPicker.querySelector("[data-country-picker-input]");
    const countryPickerTrigger = countryPicker.querySelector("[data-country-picker-trigger]");
    const countryPickerPanel = countryPicker.querySelector("[data-country-picker-panel]");
    const countryPickerSearch = countryPicker.querySelector("[data-country-picker-search]");
    const countryPickerFlag = countryPicker.querySelector("[data-country-picker-flag]");
    const countryPickerLabel = countryPicker.querySelector("[data-country-picker-label]");
    const countryPickerCode = countryPicker.querySelector("[data-country-picker-code]");
    const countryPickerEmpty = countryPicker.querySelector("[data-country-picker-empty]");
    const scopedCountryOptions = Array.from(countryPicker.querySelectorAll("[data-country-option]"));

    if (!countryInput || !countryPickerTrigger || !countryPickerPanel || !scopedCountryOptions.length) return;

    const closeCountryPicker = function () {
      countryPicker.classList.remove("is-open");
      countryPickerTrigger.setAttribute("aria-expanded", "false");
      countryPickerPanel.hidden = true;
    };

    const openCountryPicker = function () {
      countryPicker.classList.add("is-open");
      countryPickerTrigger.setAttribute("aria-expanded", "true");
      countryPickerPanel.hidden = false;
      if (countryPickerSearch) {
        countryPickerSearch.focus();
        countryPickerSearch.select();
      }
    };

    const syncCountryOptionVisibility = function () {
      const rawQuery = countryPickerSearch ? countryPickerSearch.value.trim().toLowerCase() : "";
      const normalizedQuery = normalizeCountrySearch(rawQuery);
      const normalizedCodeQuery = normalizeCodeDigits(rawQuery);
      const isCodeOnlyQuery = Boolean(normalizedCodeQuery) && !/[a-z]/i.test(rawQuery);
      const hasExactCodeMatch = isCodeOnlyQuery
        ? scopedCountryOptions.some(function (option) {
            return normalizeCodeDigits(option.dataset.countryCode || "") === normalizedCodeQuery;
          })
        : false;
      let visibleCount = 0;

      scopedCountryOptions.forEach(function (option) {
        const optionQuery = option.dataset.countryQuery || "";
        const normalizedOptionQuery = normalizeCountrySearch(optionQuery);
        const optionCodeDigits = normalizeCodeDigits(option.dataset.countryCode || "");
        let matches = false;

        if (!rawQuery) {
          matches = true;
        } else if (isCodeOnlyQuery) {
          matches = hasExactCodeMatch
            ? optionCodeDigits === normalizedCodeQuery
            : optionCodeDigits.startsWith(normalizedCodeQuery);
        } else {
          matches = optionQuery.includes(rawQuery) || normalizedOptionQuery.includes(normalizedQuery);
        }

        option.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (countryPickerEmpty) {
        countryPickerEmpty.hidden = visibleCount !== 0;
      }
    };

    const selectCountryOption = function (option, selectionOptions) {
      if (!option) return;

      const nextFlag = option.dataset.countryFlag || "";
      const nextLabel = option.dataset.countryLabel || "";
      const nextCode = option.dataset.countryCode || "";

      countryInput.value = nextCode;
      if (countryPickerFlag) countryPickerFlag.textContent = nextFlag;
      if (countryPickerLabel) countryPickerLabel.textContent = nextLabel;
      if (countryPickerCode) countryPickerCode.textContent = nextCode;

      scopedCountryOptions.forEach(function (item) {
        const active = item === option;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-selected", String(active));
      });

      if (countryPickerSearch) {
        countryPickerSearch.value = "";
      }

      if (countryInput === phoneCountryInput) {
        const phoneFieldWrap = document.getElementById("phoneField");
        if (phoneFieldWrap) {
          phoneFieldWrap.classList.remove("has-error");
        }
        if (formError) {
          formError.classList.remove("is-visible");
        }
      }

      syncCountryOptionVisibility();
      if (!selectionOptions || selectionOptions.close !== false) {
        closeCountryPicker();
      }
    };

    const selectCountryByCode = function (countryCode) {
      const normalizedCode = normalizeDialCode(countryCode || "");
      const matchedOption = scopedCountryOptions.find(function (option) {
        return normalizeDialCode(option.dataset.countryCode || "") === normalizedCode;
      });

      if (matchedOption) {
        selectCountryOption(matchedOption, { close: false });
      } else if (normalizedCode) {
        countryInput.value = normalizedCode;
      }
    };

    countryPickerTrigger.addEventListener("click", function () {
      if (countryPicker.classList.contains("is-open")) {
        closeCountryPicker();
      } else {
        openCountryPicker();
      }
    });

    scopedCountryOptions.forEach(function (option) {
      option.addEventListener("click", function () {
        selectCountryOption(option);
      });
    });

    if (countryPickerSearch) {
      countryPickerSearch.addEventListener("input", syncCountryOptionVisibility);
      countryPickerSearch.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          closeCountryPicker();
          countryPickerTrigger.focus();
        }
      });
    }

    document.addEventListener("click", function (event) {
      if (!countryPicker.classList.contains("is-open")) return;
      if (countryPicker.contains(event.target)) return;
      closeCountryPicker();
    });

    syncCountryOptionVisibility();
    countryPickerControllers.set(countryPicker, {
      close: closeCountryPicker,
      open: openCountryPicker,
      selectByCode: selectCountryByCode
    });
  }

  countryPickers.forEach(function (countryPicker) {
    setupCountryPicker(countryPicker);
  });

  function syncCountryPickerByInput(input, countryCode) {
    if (!input) return;
    const normalizedCode = normalizeDialCode(countryCode || "");
    input.value = normalizedCode;
    const picker = input.closest("[data-country-picker]");
    const controller = picker ? countryPickerControllers.get(picker) : null;
    if (controller && typeof controller.selectByCode === "function") {
      controller.selectByCode(normalizedCode);
    }
  }

  function showDuplicateSuccess(message) {
    const successTitle = success ? success.querySelector("h3") : null;
    const successCopy = success ? success.querySelector(".section-copy") : null;

    form.style.display = "none";
    if (successTitle) successTitle.textContent = "Thank you";
    if (successCopy) successCopy.textContent = message;
    if (success) success.classList.add("is-visible");
  }

  const splitName = Boolean(config.split_name);
  const fields = {
    phone: {
      input: document.getElementById("landing_phone"),
      wrap: document.getElementById("phoneField"),
      test: function () {
        return true;
      }
    },
    email: {
      input: document.getElementById("landing_email"),
      wrap: document.getElementById("emailField"),
      test: function (value) {
        return isValidEmailValue(value);
      }
    },
    comments: {
      input: document.getElementById("landing_comments"),
      wrap: document.getElementById("commentsField"),
      test: function (value) {
        return value.trim().length >= 3;
      }
    },
    project: {
      input: document.getElementById("landing_preferred_project"),
      wrap: document.getElementById("projectField"),
      test: function (value) {
        return value.trim() !== "";
      }
    },
    propertyType: {
      input: document.getElementById("landing_property_type"),
      wrap: document.getElementById("propertyTypeField"),
      test: function (value) {
        return value.trim() !== "";
      }
    }
  };

  if (splitName) {
    fields.firstName = {
      input: document.getElementById("landing_first_name"),
      wrap: document.getElementById("firstNameField"),
      test: function (value) {
        return value.trim().length >= 2;
      }
    };
    fields.lastName = {
      input: document.getElementById("landing_last_name"),
      wrap: document.getElementById("lastNameField"),
      test: function (value) {
        return value.trim().length >= 2;
      }
    };
  } else {
    fields.name = {
      input: document.getElementById("landing_full_name"),
      wrap: document.getElementById("nameField"),
      test: function (value) {
        return value.trim().length >= 2;
      }
    };
  }

  Object.keys(fields).forEach(function (key) {
    const field = fields[key];
    if (!field.input) return;
    field.input.addEventListener("input", function () {
      if (key === "phone") {
        field.input.value = field.input.value.replace(/[^\d\s\-()]/g, "");
      }
      setError(field, false);
      if (formError) formError.classList.remove("is-visible");
    });
    field.input.addEventListener("change", function () {
      setError(field, false);
      if (formError) formError.classList.remove("is-visible");
    });
  });

  const bottomLeadForm = document.querySelector("[data-bottom-lead-form]");
  const bottomLeadFormError = document.getElementById("bottomFormError");
  const bottomSubmitBtn = document.getElementById("bottomSubmitBtn");
  const bottomSubmitLabel = bottomSubmitBtn ? bottomSubmitBtn.textContent : "Submit";
  const bottomPhoneCountryInput = document.getElementById("bottom_phone_country");
  const bottomFields = {
    name: {
      input: document.getElementById("bottom_full_name"),
      wrap: document.getElementById("bottomNameField"),
      test: function (value) {
        return value.trim().length >= 2;
      }
    },
    phone: {
      input: document.getElementById("bottom_phone"),
      wrap: document.getElementById("bottomPhoneField"),
      test: function () {
        return true;
      }
    },
    email: {
      input: document.getElementById("bottom_email"),
      wrap: document.getElementById("bottomEmailField"),
      test: function (value) {
        return isValidEmailValue(value);
      }
    },
    comments: {
      input: document.getElementById("bottom_comments"),
      wrap: document.getElementById("bottomCommentsField"),
      test: function (value) {
        return value.trim().length >= 3;
      }
    }
  };

  function setBottomError(field, hasError) {
    if (!field || !field.wrap) return;
    field.wrap.classList.toggle("has-error", hasError);
    if (field.input) field.input.setAttribute("aria-invalid", hasError ? "true" : "false");
  }

  function clearBottomFormError() {
    if (bottomLeadFormError) bottomLeadFormError.classList.remove("is-visible");
  }

  function focusBottomFieldError(field) {
    if (field && field.input && typeof field.input.focus === "function") {
      field.input.focus();
    }
  }

  function fillMainFormFromBottom(validatedPhone) {
    const bottomName = bottomFields.name.input.value.trim();
    const bottomEmail = normalizeEmailValue(bottomFields.email.input.value);
    const bottomComments = bottomFields.comments.input.value.trim();

    if (splitName) {
      const nameParts = bottomName.split(/\s+/);
      if (fields.firstName && fields.firstName.input) fields.firstName.input.value = nameParts.shift() || bottomName;
      if (fields.lastName && fields.lastName.input) fields.lastName.input.value = nameParts.join(" ") || bottomName;
    } else if (fields.name && fields.name.input) {
      fields.name.input.value = bottomName;
    }

    if (fields.phone && fields.phone.input) fields.phone.input.value = validatedPhone.phoneLocal;
    syncCountryPickerByInput(phoneCountryInput, validatedPhone.countryCode);
    if (fields.email && fields.email.input) fields.email.input.value = bottomEmail;
    if (fields.comments && fields.comments.input) fields.comments.input.value = bottomComments;
  }

  if (bottomLeadForm) {
    Object.keys(bottomFields).forEach(function (key) {
      const field = bottomFields[key];
      if (!field.input) return;
      field.input.addEventListener("input", function () {
        if (key === "phone") {
          field.input.value = field.input.value.replace(/[^\d\s\-()]/g, "");
        }
        setBottomError(field, false);
        clearBottomFormError();
      });
      field.input.addEventListener("change", function () {
        setBottomError(field, false);
        clearBottomFormError();
      });
    });

    bottomLeadForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearBottomFormError();

      let valid = true;
      let firstInvalidField = null;
      let validatedBottomPhone = null;

      Object.keys(bottomFields).forEach(function (key) {
        const field = bottomFields[key];
        const inputValue = field.input ? field.input.value || "" : "";
        const isValid =
          key === "phone"
            ? Boolean(
                (validatedBottomPhone = buildValidatedPhoneNumber(
                  inputValue,
                  bottomPhoneCountryInput ? bottomPhoneCountryInput.value : "",
                  allowedPhoneCountryCodes
                )).valid
              )
            : field.input && field.test(inputValue);

        setBottomError(field, !isValid);
        if (!isValid) {
          valid = false;
          if (!firstInvalidField) firstInvalidField = field;
        }
      });

      if (!valid) {
        focusBottomFieldError(firstInvalidField);
        return;
      }

      fillMainFormFromBottom(validatedBottomPhone);
      Object.keys(fields).forEach(function (key) {
        setError(fields[key], false);
      });
      if (bottomSubmitBtn) {
        bottomSubmitBtn.disabled = true;
        bottomSubmitBtn.textContent = "Submitting...";
      }

      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      window.setTimeout(function () {
        if (!bottomSubmitBtn) return;
        if (success && success.classList.contains("is-visible")) return;
        bottomSubmitBtn.disabled = false;
        bottomSubmitBtn.textContent = bottomSubmitLabel;
      }, 3500);
    });
  }

  const whatsappCtas = Array.from(document.querySelectorAll("[data-whatsapp-cta]"));
  const whatsappModal = document.querySelector("[data-whatsapp-modal]");
  const whatsappModalCloseButtons = Array.from(document.querySelectorAll("[data-whatsapp-modal-close]"));
  const whatsappModalCountryInput = document.getElementById("whatsappModalCountryCode");
  const whatsappModalPhoneInput = document.getElementById("whatsappModalPhone");
  const whatsappModalPhoneField = document.getElementById("whatsappModalPhoneField");
  const whatsappModalError = document.getElementById("whatsappModalError");
  const whatsappModalBlocked = document.getElementById("whatsappModalBlocked");
  const whatsappModalContinue = document.getElementById("whatsappModalContinue");
  const defaultWhatsAppModalLabel = whatsappModalContinue ? whatsappModalContinue.textContent : "Continue to WhatsApp";
  const defaultWhatsAppPhoneErrorMessage =
    whatsappModalPhoneField && whatsappModalPhoneField.querySelector(".field-error")
      ? whatsappModalPhoneField.querySelector(".field-error").textContent.trim()
      : "Please enter a valid phone number before continuing to WhatsApp.";
  let activeWhatsAppLink = null;

  function setWhatsAppModalError(message) {
    if (!whatsappModalError) return;
    whatsappModalError.textContent = message;
    whatsappModalError.classList.add("is-visible");
  }

  function setWhatsAppModalPhoneError(hasError) {
    if (!whatsappModalPhoneField || !whatsappModalPhoneInput) return;
    whatsappModalPhoneField.classList.toggle("has-error", hasError);
    whatsappModalPhoneInput.setAttribute("aria-invalid", hasError ? "true" : "false");
  }

  function clearWhatsAppModalState() {
    setWhatsAppModalPhoneError(false);
    if (whatsappModalError) whatsappModalError.classList.remove("is-visible");
    if (whatsappModalBlocked) whatsappModalBlocked.classList.remove("is-visible");
    if (whatsappModalContinue) {
      whatsappModalContinue.disabled = false;
      whatsappModalContinue.textContent = defaultWhatsAppModalLabel;
    }
  }

  function closeWhatsAppModal() {
    if (!whatsappModal) return;
    clearWhatsAppModalState();
    whatsappModal.hidden = true;
    whatsappModal.classList.remove("is-visible");
    whatsappModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    activeWhatsAppLink = null;
  }

  function openWhatsAppModal(link) {
    if (!whatsappModal) return;
    activeWhatsAppLink = link;
    clearWhatsAppModalState();

    if (whatsappModalCountryInput) {
      syncCountryPickerByInput(whatsappModalCountryInput, phoneCountryInput ? phoneCountryInput.value : "+971");
    }
    if (whatsappModalPhoneInput) {
      whatsappModalPhoneInput.value = fields.phone && fields.phone.input ? String(fields.phone.input.value || "").trim() : "";
    }

    whatsappModal.hidden = false;
    whatsappModal.classList.add("is-visible");
    whatsappModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.setTimeout(function () {
      if (whatsappModalPhoneInput && typeof whatsappModalPhoneInput.focus === "function") {
        whatsappModalPhoneInput.focus();
        whatsappModalPhoneInput.select();
      }
    }, 40);
  }

  function buildWhatsAppTrackingPayload(link) {
    const ctaLocation = link ? String(link.dataset.ctaLocation || "whatsapp_cta") : "whatsapp_cta";
    const destinationUrl = link ? String(link.dataset.whatsappDestination || link.href || "").trim() : "";
    return Object.assign(
      {
        cta_type: "whatsapp",
        cta_label: "WhatsApp",
        cta_location: ctaLocation,
        destination_url: destinationUrl,
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        project_name: config.project_name,
        project_slug: config.project_slug,
        source_page: config.source_page,
        gclid: clickIds.gclid,
        gbraid: clickIds.gbraid,
        wbraid: clickIds.wbraid,
        fbclid: clickIds.fbclid,
        ttclid: clickIds.ttclid,
        ScCid: clickIds.ScCid,
        li_fat_id: clickIds.li_fat_id,
        rdt_cid: clickIds.rdt_cid
      },
      utmData
    );
  }

  function buildWhatsAppLeadPayload(validatedPhone, link) {
    const firstName = fields.firstName && fields.firstName.input ? fields.firstName.input.value.trim() : "";
    const lastName = fields.lastName && fields.lastName.input ? fields.lastName.input.value.trim() : "";
    const fullName = splitName
      ? (firstName + " " + lastName).trim()
      : fields.name && fields.name.input
        ? fields.name.input.value.trim()
        : "";
    const emailNormalized = fields.email && fields.email.input ? normalizeEmailValue(fields.email.input.value) : "";
    const preferredProject = fields.project && fields.project.input ? fields.project.input.value.trim() : "";
    const propertyType = fields.propertyType && fields.propertyType.input ? fields.propertyType.input.value.trim() : "";
    const leadId = createLeadId();

    return Object.assign(
      {
        lead_id: leadId,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        name: fullName,
        phone: validatedPhone.e164,
        phone_number: validatedPhone.e164,
        phone_local: validatedPhone.phoneLocal,
        phone_country_code: validatedPhone.countryCode,
        email: emailNormalized,
        preferred_project: preferredProject || config.project_name,
        preferred_unit: preferredProject || config.project_name,
        property_type: propertyType || "",
        inquiry_type: propertyType || "",
        project_name: config.project_name,
        project_slug: config.project_slug,
        source_page: config.source_page,
        landing_page_url: config.landing_page_url,
        thank_you_page_url: config.thank_you_page_url,
        project: config.project_name,
        brokerage: "Oaklyn Realty",
        source: config.source_page,
        submitted_at: new Date().toISOString(),
        page_url: window.location.href,
        entry_point: "whatsapp_verification_popup",
        cta_location: link ? String(link.dataset.ctaLocation || "") : "",
        gclid: clickIds.gclid,
        gbraid: clickIds.gbraid,
        wbraid: clickIds.wbraid,
        google_click_id: clickIds.gclid || clickIds.gbraid || clickIds.wbraid,
        message: "",
        gdpr_consent:
          "By submitting this form, you agree to be contacted by Oaklyn Realty regarding your property inquiry."
      },
      utmData
    );
  }

  function sendWhatsAppLeadWebhook(payload) {
    if (!config.whatsapp_webhook_url) return Promise.resolve();

    const requestBody = new URLSearchParams();
    Object.keys(payload).forEach(function (key) {
      requestBody.append(key, payload[key] == null ? "" : String(payload[key]));
    });

    return fetch(config.whatsapp_webhook_url, {
      method: "POST",
      body: requestBody,
      keepalive: true
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("WhatsApp webhook request failed with status " + response.status);
      }
      return response.text();
    });
  }

  async function handleWhatsAppModalContinue() {
    if (!activeWhatsAppLink) return;

    clearWhatsAppModalState();

    const rawCountryCode = whatsappModalCountryInput ? whatsappModalCountryInput.value : "+971";
    const rawPhone = whatsappModalPhoneInput ? whatsappModalPhoneInput.value : "";
    const validatedPhone = buildValidatedPhoneNumber(rawPhone, rawCountryCode, allowedPhoneCountryCodes);

    if (!validatedPhone.valid) {
      setWhatsAppModalPhoneError(true);
      setWhatsAppModalError(defaultWhatsAppPhoneErrorMessage);
      pushDataLayerEvent(
        Object.assign(
          {
            event: "whatsapp_cta_validation_error"
          },
          buildWhatsAppTrackingPayload(activeWhatsAppLink)
        )
      );
      if (whatsappModalPhoneInput && typeof whatsappModalPhoneInput.focus === "function") {
        whatsappModalPhoneInput.focus();
      }
      return;
    }

    const linkForTracking = activeWhatsAppLink;
    const destinationUrl = String(
      linkForTracking.dataset.whatsappDestination || linkForTracking.href || ""
    ).trim();

    if (whatsappModalContinue) {
      whatsappModalContinue.disabled = true;
    }

    closeWhatsAppModal();

    showVerification(async function () {
      try {
        const whatsappLeadPayload = buildWhatsAppLeadPayload(validatedPhone, linkForTracking);
        const whatsappTrackingPayload = Object.assign(
          {
            lead_id: whatsappLeadPayload.lead_id,
            event_id: whatsappLeadPayload.lead_id
          },
          buildWhatsAppTrackingPayload(linkForTracking)
        );
        setLeadMatchKeys({
          email: whatsappLeadPayload.email,
          phone: whatsappLeadPayload.phone_number
        });

        await sendWhatsAppLeadWebhook(whatsappLeadPayload)
          .then(function () {
            pushDataLayerEvent(
              Object.assign(
                {
                  event: "whatsapp_webhook_success",
                  webhook_status: "success"
                },
                whatsappTrackingPayload
              )
            );
          })
          .catch(function (error) {
            console.error("[whatsapp] Popup webhook failed", error);
            pushDataLayerEvent(
              Object.assign(
                {
                  event: "whatsapp_webhook_error",
                  webhook_status: "error",
                  error_message: error && error.message ? error.message : "unknown"
                },
                whatsappTrackingPayload
              )
            );
          });

        pushDataLayerEvent(
          Object.assign(
            {
              event: "whatsapp_cta_click"
            },
            whatsappTrackingPayload
          )
        );

        pushDataLayerEvent(
          Object.assign(
            {
              event: "whatsapp_cta_conversion",
              conversion_type: "whatsapp"
            },
            whatsappTrackingPayload
          )
        );

        window.location.assign(destinationUrl);
      } catch (error) {
        console.error("[whatsapp] Verification failed", error);
        openWhatsAppModal(linkForTracking);
        if (whatsappModalCountryInput) whatsappModalCountryInput.value = validatedPhone.countryCode;
        if (whatsappModalPhoneInput) whatsappModalPhoneInput.value = validatedPhone.phoneLocal;
        setWhatsAppModalError("Something went wrong. Please try again.");
        pushDataLayerEvent(
          Object.assign(
            {
              event: "whatsapp_cta_verification_error"
            },
            buildWhatsAppTrackingPayload(linkForTracking)
          )
        );

        if (whatsappModalContinue) {
          whatsappModalContinue.disabled = false;
          whatsappModalContinue.textContent = defaultWhatsAppModalLabel;
        }
      }
    });
  }

  if (whatsappModal) {
    whatsappModalCloseButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        closeWhatsAppModal();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && whatsappModal.classList.contains("is-visible")) {
        closeWhatsAppModal();
      }
    });
  }

  if (whatsappModalPhoneInput) {
    whatsappModalPhoneInput.addEventListener("input", function () {
      whatsappModalPhoneInput.value = whatsappModalPhoneInput.value.replace(/[^\d\s\-()]/g, "");
      setWhatsAppModalPhoneError(false);
      if (whatsappModalError) whatsappModalError.classList.remove("is-visible");
      if (whatsappModalBlocked) whatsappModalBlocked.classList.remove("is-visible");
    });
  }

  if (whatsappModalCountryInput) {
    whatsappModalCountryInput.addEventListener("input", function () {
      whatsappModalCountryInput.value = whatsappModalCountryInput.value.replace(/[^\d+]/g, "");
      if (whatsappModalError) whatsappModalError.classList.remove("is-visible");
    });
  }

  if (whatsappModalContinue) {
    whatsappModalContinue.addEventListener("click", function () {
      handleWhatsAppModalContinue();
    });
  }

  const whatsappClickTargets = Array.from(
    new Set(whatsappCtas.concat(Array.from(document.querySelectorAll('a[href*="wa.me"]'))))
  );
  whatsappClickTargets.forEach(function (link) {
    link.addEventListener("click", handleWhatsApp);
  });

  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener("click", handleCall);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setFormErrorMessage("We could not submit your enquiry. Please try again or contact Oaklyn Realty directly.");
    if (formError) formError.classList.remove("is-visible");

    if (honeypot && honeypot.value.trim() !== "") return;

    let valid = true;
    let firstInvalidField = null;
    let validatedPhone = null;
    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      const inputValue = field.input ? field.input.value || "" : "";
      const isValid =
        key === "phone"
          ? Boolean(
              (validatedPhone = buildValidatedPhoneNumber(
                inputValue,
                phoneCountryInput ? phoneCountryInput.value : "",
                allowedPhoneCountryCodes
              )).valid
            )
          : field.input && field.test(inputValue);
      setError(field, !isValid);
      if (!isValid) {
        valid = false;
        if (!firstInvalidField && field.wrap && field.wrap.offsetParent !== null) {
          firstInvalidField = field;
        }
      }
    });

    if (!valid) {
      focusFieldError(firstInvalidField);
      return;
    }

    const leadId = createLeadId();
    const phoneCountryCode = validatedPhone ? validatedPhone.countryCode : "";
    const phoneLocal = validatedPhone ? validatedPhone.phoneLocal : stripPhoneFormatting(fields.phone.input.value.trim());
    const phoneFull = validatedPhone ? validatedPhone.e164 : "";
    fields.phone.input.value = phoneLocal;
    const firstName = fields.firstName && fields.firstName.input ? fields.firstName.input.value.trim() : "";
    const lastName = fields.lastName && fields.lastName.input ? fields.lastName.input.value.trim() : "";
    const fullName = splitName ? (firstName + " " + lastName).trim() : fields.name.input.value.trim();
    const formName = fullName;
    const formPhone = phoneFull;
    const formEmail = normalizeEmailValue(fields.email.input.value);
    const formUnit = fields.project.input.value.trim();
    const formInquiry = fields.propertyType.input.value.trim();
    const formComments = fields.comments && fields.comments.input ? fields.comments.input.value.trim() : "";

    if (leadIdInput) leadIdInput.value = leadId;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Verifying...";
    }

    showVerification(async function () {
      if (submitBtn) {
        submitBtn.textContent = "Submitting...";
      }

      const submittedAt = new Date().toISOString();
      const nameParts = splitFullNameForMatching(fullName);
      const resolvedFirstName = firstName || nameParts.firstName;
      const resolvedLastName = lastName || nameParts.lastName;
      const campaignName = getCampaignName();
      const campaignSearchTerm = getCampaignSearchTerm();
      const adSystem = getAdSystem();
      const medium = getTrackingMedium(adSystem);
      const sourceInformation = buildSourceInformation(adSystem, medium, campaignName);
      const leadLanguage = getLeadLanguage();
      const selectedCountry = getSelectedCountryLabel(phoneCountryCode) || phoneCountryCode;
      const propertyLink = config.landing_page_url || window.location.href;
      const whatsappTrackingLink =
        config.whatsapp_tracking_link ||
        "https://wa.me/971505886769?text=Hello%20Oaklyn%20Realty%2C%20I%20am%20interested%20in%20Arancia%20Yards%20by%20BEYOND";
      const leadCommentText = formComments || formInquiry || "Arancia Yards by BEYOND inquiry";
      const crmComment = buildCrmComment({
        projectName: config.project_name,
        fullName,
        phone: formPhone,
        email: formEmail,
        country: selectedCountry,
        bedroom: formUnit,
        propertyType: formInquiry,
        interestedIn: config.project_name,
        comment: leadCommentText,
        sourceInformation,
        gclid: clickIds.gclid,
        fbclid: clickIds.fbclid,
        utmSource: utmData.utm_source,
        utmMedium: utmData.utm_medium,
        utmCampaign: utmData.utm_campaign,
        utmContent: utmData.utm_content,
        utmTerm: utmData.utm_term,
        campaignSearchTerm,
        propertyLink,
        whatsappLink: whatsappTrackingLink,
        eventId: leadId
      });

      const payload = Object.assign(
        {
          lead_id: leadId,
          event_id: leadId,
          events_id: leadId,
          first_name: resolvedFirstName,
          last_name: resolvedLastName,
          full_name: fullName,
          name: formName,
          phone: formPhone,
          phone_number: formPhone,
          phone_local: phoneLocal,
          phone_country_code: phoneCountryCode,
          email: formEmail,
          unit: formUnit,
          inquiry: formComments || formInquiry,
          comments: leadCommentText,
          inquiry_message: leadCommentText,
          preferred_project: formUnit,
          preferred_unit: formUnit,
          property_type: formInquiry,
          inquiry_type: formInquiry,
          project_interest: formUnit,
          unit_type: formInquiry,
          project_name: config.project_name,
          project_slug: config.project_slug,
          source_page: config.source_page,
          landing_page_url: config.landing_page_url,
          thank_you_page_url: config.thank_you_page_url,
          property_link: propertyLink,
          whatsapp_tracking_link: whatsappTrackingLink,
          general_whatsapp_link: whatsappTrackingLink,
          campaign_name: campaignName,
          campaign_search_term: campaignSearchTerm,
          source_information: sourceInformation,
          ad_system: adSystem,
          medium,
          language: leadLanguage,
          country: selectedCountry,
          landing_page_variant: LANDING_PAGE_VARIANT,
          project: config.project_name,
          brokerage: "Oaklyn Realty",
          source: document.referrer || "direct",
          submitted_at: submittedAt,
          timestamp: submittedAt,
          page: window.location.href,
          page_url: window.location.href,
          gclid: clickIds.gclid,
          gbraid: clickIds.gbraid,
          wbraid: clickIds.wbraid,
          fbclid: clickIds.fbclid,
          ttclid: clickIds.ttclid,
          ScCid: clickIds.ScCid,
          li_fat_id: clickIds.li_fat_id,
          rdt_cid: clickIds.rdt_cid,
          google_click_id: clickIds.gclid || clickIds.gbraid || clickIds.wbraid,
          meta_click_id: clickIds.fbclid,
          tiktok_click_id: clickIds.ttclid,
          snapchat_click_id: clickIds.ScCid,
          linkedin_click_id: clickIds.li_fat_id,
          reddit_click_id: clickIds.rdt_cid,
          buyer_type: "",
          preferred_contact: "",
          budget_range: "",
          message: leadCommentText,
          crm_comment: crmComment,
          gdpr_consent:
            "By submitting this form, you agree to be contacted by our property consultants regarding your inquiry.",
          TITLE: config.project_name + " - " + fullName,
          "Lead Title": config.project_name + " - " + fullName,
          FULL_NAME: fullName,
          NAME: resolvedFirstName || fullName,
          LAST_NAME: resolvedLastName,
          PHONE_WORK: formPhone,
          PHONE_MOBILE: formPhone,
          EMAIL_WORK: formEmail,
          COMMENTS: crmComment,
          SOURCE_ID: adSystem,
          SOURCE_DESCRIPTION: sourceInformation,
          "Campaign name": campaignName,
          "Bedroom": formUnit,
          "Lead Name": fullName,
          "Name": resolvedFirstName || fullName,
          "Last name": resolvedLastName,
          "Source information": sourceInformation,
          "Comment": crmComment,
          "Ad system": adSystem,
          "Medium": medium,
          "Ad campaign UTM": utmData.utm_campaign,
          "Campaign contents": utmData.utm_content,
          "Campaign search term": campaignSearchTerm,
          "Language": leadLanguage,
          "Property Type": formInquiry,
          "Whatsapp Tracking Link": whatsappTrackingLink,
          "Events ID": leadId,
          "Interested IN": config.project_name,
          "Portal Lead ID": leadId,
          "Property Link": propertyLink,
          "Comments": crmComment,
          "Project Name": config.project_name,
          "GCLID": clickIds.gclid,
          "FBCLID": clickIds.fbclid,
          "UTM Source": utmData.utm_source,
          "UTM Medium": utmData.utm_medium,
          "UTM Campaign": utmData.utm_campaign,
          "UTM Content": utmData.utm_content,
          "UTM Term": utmData.utm_term,
          "Phone (mobile)": formPhone,
          "E-mail (mailing)": formEmail,
          "Comment text": crmComment,
          "Country": selectedCountry,
          "Country code": phoneCountryCode,
          "Landing-page variant": LANDING_PAGE_VARIANT,
          "Event": "lead_success",
          "Webhook": config.webhook_url
        },
        utmData
      );

      let webhookSucceeded = false;
      let leadMatchData = null;

      submitFormWebhook(payload)
        .then(function () {
          webhookSucceeded = true;
          leadMatchData = setLeadMatchKeys(
            Object.assign({}, payload, {
              lead_id: leadId,
              email: formEmail,
              phone: formPhone
            })
          );
          pushDataLayerEvent(
            Object.assign(
              {
                event: "form_webhook_success",
                project: config.project_name,
                project_name: config.project_name,
                project_slug: config.project_slug,
                lead_id: leadId,
                event_id: leadId,
                webhook_status: "success",
                campaign_name: campaignName,
                campaign_search_term: campaignSearchTerm,
                ad_system: adSystem,
                medium,
                language: leadLanguage,
                portal_lead_id: leadId,
                property_link: propertyLink,
                whatsapp_tracking_link: whatsappTrackingLink
              },
              buildLeadMatchingTrackingFields(leadMatchData),
              clickIds,
              utmData
            )
          );
        })
        .catch(function (error) {
          console.error("Webhook submit error:", error);
          setFormErrorMessage(config.form_submit_error || "We could not submit your enquiry. Please try again or contact Oaklyn Realty directly.");
          if (formError) formError.classList.add("is-visible");
          pushDataLayerEvent({
            event: "form_webhook_error",
            project: config.project_name,
            project_name: config.project_name,
            project_slug: config.project_slug,
            lead_id: leadId,
            error_message: error && error.message ? error.message : "unknown"
          });
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = defaultSubmitLabel;
          }
        })
        .finally(function () {
          if (!webhookSucceeded) return;
          if (form) form.style.display = "none";
          if (success) {
            success.classList.add("is-visible");
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          leadMatchData = leadMatchData || buildLeadMatchData(payload);
          pushDataLayerEvent(
            Object.assign(
              {
                event: "lead_success",
                conversion_type: "form",
                conversion_action: "form_submission",
                project: config.project_name,
                project_name: config.project_name,
                project_slug: config.project_slug,
                lead_id: leadId,
                event_id: leadId,
                form_submission_confirmed: true,
                form_submission_confirmed_text: "true",
                webhook_status: "success",
                preferred_unit: formUnit,
                preferred_project: formUnit,
                property_type: formInquiry,
                inquiry_type: formInquiry,
                comments: leadCommentText,
                inquiry_message: leadCommentText,
                campaign_name: campaignName,
                campaign_search_term: campaignSearchTerm,
                ad_system: adSystem,
                medium,
                language: leadLanguage,
                portal_lead_id: leadId,
                property_link: propertyLink,
                whatsapp_tracking_link: whatsappTrackingLink
              },
              buildLeadMatchingTrackingFields(leadMatchData),
              clickIds,
              utmData
            )
          );
          writeLeadSuccessState(leadId);
        });
    });
  });
})();
