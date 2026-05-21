(function () {
  const config = window.OAKLYN_LANDING_CONFIG;
  if (!config) return;

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
      if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

  function setError(field, hasError) {
    if (!field || !field.wrap || !field.input) return;
    field.wrap.classList.toggle("has-error", hasError);
  }

  function buildThankYouUrl(leadId) {
    const thankYouUrl = new URL(config.thank_you_page_url);
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

  const form = document.getElementById("landingLeadForm");
  if (!form) return;

  const honeypot = document.getElementById("landing_website");
  const submitBtn = document.getElementById("landingSubmitBtn");
  const formError = document.getElementById("landingFormError");
  const success = document.getElementById("landingSuccess");
  const gclidInput = document.getElementById("landing_gclid");
  const gbraidInput = document.getElementById("landing_gbraid");
  const wbraidInput = document.getElementById("landing_wbraid");
  const leadIdInput = document.getElementById("landing_lead_id");
  const phoneCountryInput = document.getElementById("landing_phone_country");
  const messageInput = document.getElementById("landing_message");

  if (gclidInput) gclidInput.value = clickIds.gclid;
  if (gbraidInput) gbraidInput.value = clickIds.gbraid;
  if (wbraidInput) wbraidInput.value = clickIds.wbraid;

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

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (formError) formError.classList.remove("is-visible");

    if (honeypot && honeypot.value.trim() !== "") return;

    let valid = true;
    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      const isValid = field.input && field.test(field.input.value || "");
      setError(field, !isValid);
      if (!isValid) valid = false;
    });

    if (!valid) return;

    const leadId = createLeadId();
    const phoneCountryCode = phoneCountryInput ? normalizeDialCode(phoneCountryInput.value) : "+971";
    const phoneLocal = fields.phone.input.value.trim();
    const phoneLocalDigits = phoneLocal.replace(/[^\d]/g, "").replace(/^0+/, "");
    const phoneFull = normalizePhone(phoneLocal.charAt(0) === "+" ? phoneLocal : phoneCountryCode + phoneLocalDigits);
    const propertyInterest = fields.project.input.value.trim();
    const preferredLocation = fields.propertyType.input.value.trim();
    const messageText = messageInput ? messageInput.value.trim() : "";
    const firstName = fields.firstName && fields.firstName.input ? fields.firstName.input.value.trim() : "";
    const lastName = fields.lastName && fields.lastName.input ? fields.lastName.input.value.trim() : "";
    const fullName = splitName ? (firstName + " " + lastName).trim() : fields.name.input.value.trim();
    if (leadIdInput) leadIdInput.value = leadId;
    if (submitBtn) {
      submitBtn.disabled = true;
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
        phone_local: phoneLocal,
        phone_country_code: phoneCountryCode,
        email: fields.email.input.value.trim(),
        preferred_project: propertyInterest,
        preferred_unit: propertyInterest,
        property_type: propertyInterest,
        inquiry_type: messageText || "Landing Page Enquiry",
        project_interest: propertyInterest,
        unit_type: propertyInterest,
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
        inquiry_message: messageText,
        gdpr_consent: config.form_consent || ""
      },
      utmData
    );

    const requestBody = new URLSearchParams();
    Object.keys(payload).forEach(function (key) {
      requestBody.append(key, payload[key] == null ? "" : String(payload[key]));
    });

    fetch(config.webhook_url, {
      method: "POST",
      body: requestBody
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Webhook request failed with status " + response.status);
        }
        return response.text();
      })
      .then(function () {
        form.style.display = "none";
        if (success) success.classList.add("is-visible");

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "lead_success",
          project: config.project_name,
          project_name: config.project_name,
          project_slug: config.project_slug,
          lead_id: leadId
        });

        writeLeadSuccessState(leadId);

        window.setTimeout(function () {
          window.location.href = buildThankYouUrl(leadId);
        }, 700);
      })
      .catch(function (error) {
        console.error("Webhook submit error:", error);
        if (formError) formError.classList.add("is-visible");
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Request Project Information";
        }
      });
  });
})();
