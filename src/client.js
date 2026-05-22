(function () {
  const config = window.OAKLYN_LANDING_CONFIG;
  if (!config) return;
  const root = document.documentElement;
  root.classList.add("js-enhanced");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    const syncTopbar = function () {
      topbar.classList.toggle("is-scrolled", window.scrollY > 18);
    };
    syncTopbar();
    window.addEventListener("scroll", syncTopbar, { passive: true });
  }

  const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
  if (revealNodes.length) {
    if (prefersReducedMotion || typeof window.IntersectionObserver !== "function") {
      revealNodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
    } else {
      const syncVisibleRevealNodes = function () {
        revealNodes.forEach(function (node) {
          const rect = node.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.9) {
            node.classList.add("is-visible");
          }
        });
      };

      const revealObserver = new window.IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
      );

      revealNodes.forEach(function (node, index) {
        if (index < 2) node.classList.add("is-visible");
        revealObserver.observe(node);
      });

      syncVisibleRevealNodes();
      window.addEventListener("scroll", syncVisibleRevealNodes, { passive: true });
      window.addEventListener("resize", syncVisibleRevealNodes);
      window.addEventListener("hashchange", function () {
        window.setTimeout(syncVisibleRevealNodes, 40);
      });
    }
  }

  const heroSlider = document.querySelector("[data-hero-slider]");
  const heroParallax = document.querySelector("[data-hero-parallax]");
  if (heroParallax && !prefersReducedMotion) {
    const updateHeroParallax = function () {
      const offset = Math.min(window.scrollY * 0.12, 54);
      heroParallax.style.transform = "translate3d(0, " + offset + "px, 0) scale(1.04)";
    };
    updateHeroParallax();
    window.addEventListener("scroll", updateHeroParallax, { passive: true });
  }

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
    if (heroSlides.length > 1 && !prefersReducedMotion) {
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
    let activeIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let autoTimer = null;

    function setSlide(index) {
      if (!track || !slides.length) return;
      activeIndex = (index + slides.length) % slides.length;
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
    }

    function stopAutoSlide() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAutoSlide() {
      if (slides.length < 2 || prefersReducedMotion) return;
      stopAutoSlide();
      autoTimer = window.setInterval(function () {
        setSlide(activeIndex + 1);
      }, 5600);
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
    wbraid: captureClickId("wbraid")
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

  function createLeadId() {
    return config.project_slug + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  }

  function normalizePhone(value) {
    const cleaned = String(value || "").replace(/[^\d+]/g, "");
    if (!cleaned) return "";
    if (cleaned.charAt(0) === "+") return cleaned;
    return "+" + cleaned.replace(/\D/g, "");
  }

  function normalizeDialCode(value) {
    const cleaned = String(value || "").replace(/[^\d+]/g, "");
    if (!cleaned) return "+971";
    return cleaned.charAt(0) === "+" ? cleaned : "+" + cleaned.replace(/\D/g, "");
  }

  function stripPhoneFormatting(value) {
    return String(value || "").replace(/[\s\-()]/g, "");
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

    if (!rawLocalValue) {
      return { valid: false };
    }

    if (!/^[\d\s\-()]+$/.test(rawLocalValue)) {
      return { valid: false };
    }

    const normalizedLocalInput = stripPhoneFormatting(rawLocalValue);
    if (!/^\d+$/.test(normalizedLocalInput)) {
      return { valid: false };
    }

    const nationalNumber = normalizedLocalInput.charAt(0) === "0"
      ? normalizedLocalInput.slice(1)
      : normalizedLocalInput;

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
    let thankYouUrl;
    try {
      const configuredUrl = new URL(config.thank_you_page_url, window.location.href);
      thankYouUrl = new URL(configuredUrl.pathname, window.location.origin);
    } catch (error) {
      thankYouUrl = new URL("/thank-you", window.location.origin);
    }

    thankYouUrl.searchParams.set("lead", "success");
    thankYouUrl.searchParams.set("project", config.project_slug);
    thankYouUrl.searchParams.set("lead_id", leadId);

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

  function normalizeBlacklistUrl(value) {
    const rawValue = String(value || "").trim();
    return rawValue;
  }

  function encodeBlacklistPhoneQueryValue(value) {
    const normalized = String(value || "").trim();
    if (!normalized) return "";
    if (normalized.charAt(0) === "+") {
      return "%2B+" + normalized.slice(1);
    }
    return encodeURIComponent(normalized);
  }

  function buildBlacklistRequestUrl(baseUrl, lead) {
    const [path, query = ""] = String(baseUrl || "").split("?");
    const pairs = query ? query.split("&").filter(Boolean) : [];
    const nextPairs = [];
    let hasPhone = false;
    let hasEmail = false;

    pairs.forEach(function (pair) {
      const equalsIndex = pair.indexOf("=");
      const rawKey = equalsIndex >= 0 ? pair.slice(0, equalsIndex) : pair;
      const key = decodeURIComponent(rawKey || "").trim();

      if (key === "phone_number") {
        hasPhone = true;
        nextPairs.push("phone_number=" + encodeBlacklistPhoneQueryValue(lead.phone_number || ""));
        return;
      }

      if (key === "email") {
        hasEmail = true;
        nextPairs.push("email=" + String(lead.email || "").trim());
        return;
      }

      nextPairs.push(pair);
    });

    if (!hasPhone) {
      nextPairs.unshift("phone_number=" + encodeBlacklistPhoneQueryValue(lead.phone_number || ""));
    }

    if (!hasEmail) {
      const insertionIndex = hasPhone ? 1 : 0;
      nextPairs.splice(insertionIndex, 0, "email=" + String(lead.email || "").trim());
    }

    return path + (nextPairs.length ? "?" + nextPairs.join("&") : "");
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
  const leadIdInput = document.getElementById("landing_lead_id");
  const phoneCountryInput = document.getElementById("landing_phone_country");
  const countryPicker = document.querySelector("[data-country-picker]");
  const countryPickerTrigger = countryPicker ? countryPicker.querySelector("[data-country-picker-trigger]") : null;
  const countryPickerPanel = countryPicker ? countryPicker.querySelector("[data-country-picker-panel]") : null;
  const countryPickerSearch = countryPicker ? countryPicker.querySelector("[data-country-picker-search]") : null;
  const countryPickerEmpty = countryPicker ? countryPicker.querySelector("[data-country-picker-empty]") : null;
  const countryPickerFlag = countryPicker ? countryPicker.querySelector("[data-country-picker-flag]") : null;
  const countryPickerLabel = countryPicker ? countryPicker.querySelector("[data-country-picker-label]") : null;
  const countryPickerCode = countryPicker ? countryPicker.querySelector("[data-country-picker-code]") : null;
  const countryOptions = countryPicker ? Array.from(countryPicker.querySelectorAll("[data-country-option]")) : [];
  const allowedPhoneCountryCodes = new Set(
    countryOptions
      .map(function (option) {
        return normalizeDialCode(option.dataset.countryCode || "");
      })
      .filter(Boolean)
  );
  const messageInput = document.getElementById("landing_message");

  function setFormErrorMessage(message) {
    if (!formError) return;
    formError.textContent = message;
  }

  function showBlockedSuccess(message) {
    const successTitle = success ? success.querySelector("h3") : null;
    const successCopy = success ? success.querySelector(".section-copy") : null;

    form.style.display = "none";
    if (successTitle) successTitle.textContent = "Thank you";
    if (successCopy) successCopy.textContent = message;
    if (success) {
      success.classList.add("is-visible");
      success.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  async function checkBlacklistStatus(lead) {
    const originalBlacklistUrl = String(config.blacklist_check_url || "").trim();
    const normalizedBlacklistUrl = normalizeBlacklistUrl(originalBlacklistUrl);
    if (!normalizedBlacklistUrl) {
      throw new Error("Blacklist check URL is not configured.");
    }

    if (normalizedBlacklistUrl !== originalBlacklistUrl) {
      console.info("[blacklist] Normalized Apps Script URL", {
        from: originalBlacklistUrl,
        to: normalizedBlacklistUrl
      });
    }

    const requestPayload = {
      phone_number: lead.phone_number || "",
      email: lead.email || ""
    };
    const blacklistUrl = buildBlacklistRequestUrl(normalizedBlacklistUrl, requestPayload);

    const timeoutMs = Number(config.blacklist_timeout_ms) || 8000;
    const controller = typeof window.AbortController === "function" ? new window.AbortController() : null;
    const timeoutId = controller
      ? window.setTimeout(function () {
          controller.abort();
        }, timeoutMs)
      : null;

    console.log("Checking blacklist...");
    console.info("[blacklist] Checking lead against sheet", {
      url: blacklistUrl,
      phone_number: requestPayload.phone_number,
      email: requestPayload.email
    });

    try {
      const response = await fetch(blacklistUrl, {
        method: "GET",
        cache: "no-store",
        redirect: "follow",
        headers: {
          Accept: "application/json"
        },
        signal: controller ? controller.signal : undefined
      });

      const responseText = await response.text();
      const responseContentType = response.headers.get("content-type") || "";
      const responseUrl = response.url || blacklistUrl;
      let responseJson;

      if (
        responseUrl.includes("accounts.google.com") ||
        responseText.includes("ServiceLogin") ||
        looksLikeHtmlDocument(responseText) ||
        responseContentType.includes("text/html")
      ) {
        console.error("[blacklist] API returned an auth page or HTML instead of JSON", {
          status: response.status,
          url: responseUrl,
          content_type: responseContentType
        });
        throw new Error("Blacklist API is not publicly accessible.");
      }

      try {
        responseJson = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid blacklist response.");
      }

      console.info("[blacklist] Response received", responseJson);

      if (!response.ok) {
        throw new Error("Blacklist check failed with status " + response.status);
      }

      if (!responseJson || typeof responseJson.blocked !== "boolean") {
        throw new Error("Blacklist response missing blocked flag.");
      }

      if (responseJson.error) {
        throw new Error("Blacklist response error: " + responseJson.error);
      }

      return responseJson;
    } catch (error) {
      if (error && error.name === "AbortError") {
        throw new Error("Blacklist check timed out.");
      }
      throw error;
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  }

  if (gclidInput) gclidInput.value = clickIds.gclid;
  if (gbraidInput) gbraidInput.value = clickIds.gbraid;
  if (wbraidInput) wbraidInput.value = clickIds.wbraid;

  if (countryPicker && phoneCountryInput && countryPickerTrigger && countryPickerPanel) {
    const normalizeCountrySearch = function (value) {
      return String(value || "").trim().toLowerCase().replace(/[^\da-z+]/g, "");
    };

    const normalizeCodeDigits = function (value) {
      return String(value || "").replace(/\D/g, "");
    };

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
        ? countryOptions.some(function (option) {
            return normalizeCodeDigits(option.dataset.countryCode || "") === normalizedCodeQuery;
          })
        : false;
      let visibleCount = 0;

      countryOptions.forEach(function (option) {
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
          matches =
            optionQuery.includes(rawQuery) ||
            normalizedOptionQuery.includes(normalizedQuery);
        }

        option.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (countryPickerEmpty) {
        countryPickerEmpty.hidden = visibleCount !== 0;
      }
    };

    const selectCountryOption = function (option) {
      if (!option) return;

      const nextFlag = option.dataset.countryFlag || "";
      const nextLabel = option.dataset.countryLabel || "";
      const nextCode = option.dataset.countryCode || "";

      phoneCountryInput.value = nextCode;
      if (countryPickerFlag) countryPickerFlag.textContent = nextFlag;
      if (countryPickerLabel) countryPickerLabel.textContent = nextLabel;
      if (countryPickerCode) countryPickerCode.textContent = nextCode;

      countryOptions.forEach(function (item) {
        const active = item === option;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-selected", String(active));
      });

      if (countryPickerSearch) {
        countryPickerSearch.value = "";
      }
      syncCountryOptionVisibility();
      closeCountryPicker();
    };

    countryPickerTrigger.addEventListener("click", function () {
      if (countryPicker.classList.contains("is-open")) {
        closeCountryPicker();
      } else {
        openCountryPicker();
      }
    });

    countryOptions.forEach(function (option) {
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
  }

  const splitName = Boolean(config.split_name);
  const fields = {
    phone: {
      input: document.getElementById("landing_phone"),
      wrap: document.getElementById("phoneField"),
      test: function (value) {
        return String(value || "").replace(/[^\d]/g, "").length >= 6;
      }
    },
    email: {
      input: document.getElementById("landing_email"),
      wrap: document.getElementById("emailField"),
      test: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      }
    },
    bedrooms: {
      input: document.getElementById("landing_bedrooms"),
      wrap: document.getElementById("bedroomField"),
      test: function (value) {
        return value.trim() !== "";
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
    },
    message: {
      input: document.getElementById("landing_message"),
      wrap: document.getElementById("messageField"),
      test: function () {
        return true;
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
      setError(field, false);
      if (formError) formError.classList.remove("is-visible");
    });
    field.input.addEventListener("change", function () {
      setError(field, false);
      if (formError) formError.classList.remove("is-visible");
    });
  });

  form.addEventListener("submit", async function (event) {
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
    const bedroomRequirement = fields.bedrooms.input.value.trim();
    const propertyInterest = fields.project.input.value.trim();
    const preferredLocation = fields.propertyType.input.value.trim();
    const messageText = messageInput ? messageInput.value.trim() : "";
    const firstName = fields.firstName && fields.firstName.input ? fields.firstName.input.value.trim() : "";
    const lastName = fields.lastName && fields.lastName.input ? fields.lastName.input.value.trim() : "";
    const emailNormalized = normalizeEmailValue(fields.email.input.value);
    const fullName = splitName ? (firstName + " " + lastName).trim() : fields.name.input.value.trim();
    if (leadIdInput) leadIdInput.value = leadId;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Checking...";
    }

    try {
      const blacklistResult = await checkBlacklistStatus({
        phone_number: phoneFull,
        email: emailNormalized
      });

      if (blacklistResult.blocked) {
        console.log("Lead is blacklisted. Submission blocked.");
        console.info("[blacklist] Lead blocked, webhook submission stopped", {
          phone_number: phoneFull,
          email: emailNormalized
        });

        showBlockedSuccess(config.blacklist_block_message || "Thank you. Your inquiry has already been received.");
        return;
      }

      console.log("Lead is clean. Submitting to webhook.");
    } catch (error) {
      console.error("[blacklist] Check failed", error);
      setFormErrorMessage(config.blacklist_error_message || "Something went wrong. Please try again.");
      if (formError) {
        formError.classList.add("is-visible");
        formError.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
      return;
    }

    if (submitBtn) {
      submitBtn.textContent = "Submitting...";
    }

    const payload = Object.assign(
      {
        lead_id: leadId,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        name: fullName,
        phone: phoneFull,
        phone_number: phoneFull,
        phone_local: phoneLocal,
        phone_country_code: phoneCountryCode,
        email: emailNormalized,
        preferred_project: propertyInterest,
        project_requirements: propertyInterest,
        requirements_of_project: propertyInterest,
        bedroom_requirement: bedroomRequirement,
        bedrooms_required: bedroomRequirement,
        bedrooms: bedroomRequirement,
        preferred_unit: bedroomRequirement,
        unit_type: bedroomRequirement,
        property_type: bedroomRequirement,
        inquiry_type: messageText || "Landing Page Enquiry",
        project_interest: propertyInterest,
        preferred_location: preferredLocation,
        location_interest: preferredLocation,
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
        gclid: clickIds.gclid,
        gbraid: clickIds.gbraid,
        wbraid: clickIds.wbraid,
        google_click_id: clickIds.gclid || clickIds.gbraid || clickIds.wbraid,
        buyer_type: "",
        preferred_contact: "",
        budget_range: "",
        message: messageText,
        comments: messageText,
        comment: messageText,
        inquiry_message: messageText,
        gdpr_consent: config.form_consent || ""
      },
      utmData
    );

    const requestBody = new URLSearchParams();
    Object.keys(payload).forEach(function (key) {
      requestBody.append(key, payload[key] == null ? "" : String(payload[key]));
    });

    console.info("[lead] Sending webhook submission", {
      lead_id: leadId,
      phone_number: phoneFull,
      email: emailNormalized
    });

    try {
      const response = await fetch(config.webhook_url, {
        method: "POST",
        body: requestBody
      });

      if (!response.ok) {
        throw new Error("Webhook request failed with status " + response.status);
      }

      await response.text();
      console.info("[lead] Webhook submission succeeded", { lead_id: leadId });

      form.style.display = "none";
      if (success) success.classList.add("is-visible");

      writeLeadSuccessState(leadId);

      console.log("Redirecting to thank-you page.");
      window.setTimeout(function () {
        window.location.href = buildThankYouUrl(leadId);
      }, 700);
    } catch (error) {
      console.error("Webhook submit error:", error);
      setFormErrorMessage("We could not submit your enquiry. Please try again or contact Oaklyn Realty directly.");
      if (formError) {
        formError.classList.add("is-visible");
        formError.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultSubmitLabel;
      }
    }
  });
})();
