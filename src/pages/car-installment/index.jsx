import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { cifEg } from "@coreui/icons";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const CAR_IMG =
  "https://contact-app-prod.s3.us-east-2.amazonaws.com/contact.eg/cars-cover-small.webp";

// Google's public test site key — always verifies successfully, safe for
// demos. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your own key for production.
const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const CIcon = dynamic(
  () => import("@coreui/icons-react").then((m) => m.default),
  {
    ssr: false,
  },
);

import { useI18n } from "@/i18n/I18nProvider";
import { api } from "@/utils/api";
import { ciStyles as S } from "@/utils/styles/car-installment-styles";
import InstallmentStepper from "@/components/car-installment/InstallmentStepper";
import BranchModal from "@/components/car-installment/BranchModal";
import PageHead from "@/components/PageHead";

const NAVY = "#212564";
const ORANGE = "#F18222";

const INSTALLMENT_OPTIONS = [12, 24, 36, 48, 60, 72];
const YEAR_OPTIONS = Array.from({ length: 16 }, (_, i) => 2025 - i);

/* ─── Upload an image file to S3 via presigned URL ─── */
async function uploadToS3(file, imageType, phone) {
  try {
    const res = await api.post("/s3/public/generate-presigned-url", {
      phone: "+20" + phone,
      imageType,
    });
    if (res.data?.uploadUrl) {
      await axios.put(res.data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
    }
    return res.data?.fileUrl || null;
  } catch {
    // upload failed — proceed without URL
  }
  return null;
}

/* ─── Field label ─── */
function FieldLabel({ children }) {
  return (
    <Typography component="label" sx={S.fieldLabel}>
      {children}
    </Typography>
  );
}

/* ─── Select wrapper ─── */
function CISelect({ value, onChange, placeholder, options, name, disabled }) {
  const { locale } = useI18n();
  const isRtl = locale !== "en";

  return (
    <Select
      value={value}
      onChange={onChange}
      name={name}
      displayEmpty
      disabled={disabled}
      sx={{
        ...S.selectField,
        "& .MuiSelect-select": { textAlign: isRtl ? "right" : "left" },
      }}
      size="small"
      inputProps={{ sx: { py: "10.5px" } }}
    >
      <MenuItem value="" disabled>
        <Typography sx={{ color: "#aaa", fontSize: "14px" }}>
          {placeholder}
        </Typography>
      </MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </MenuItem>
      ))}
    </Select>
  );
}

/* ─── ID Upload Box ─── */
function UploadBox({
  label,
  hint,
  preview,
  onFileChange,
  chooseLabel,
  changeLabel,
}) {
  const inputRef = useRef();

  return (
    <Box
      sx={S.uploadBox}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        hidden
        onChange={onFileChange}
      />
      <Typography sx={S.uploadBoxLabel}>{label}</Typography>
      {preview ? (
        <>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 70, md: 90 },
              mt: 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={label}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
          <Typography
            sx={S.changeImageLink}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {changeLabel}
          </Typography>
        </>
      ) : (
        <>
          <UploadFileOutlinedIcon
            sx={{ fontSize: { xs: 32, md: 40 }, color: "#C0C0C0", my: 0.75 }}
          />
          <Typography sx={S.uploadBoxHint}>{hint}</Typography>
          <Typography
            sx={S.chooseImageLink}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {chooseLabel}
          </Typography>
        </>
      )}
    </Box>
  );
}

/* ─── Section title ─── */
function SectionTitle({ children }) {
  return <Typography sx={S.sectionTitle}>{children}</Typography>;
}

/* ════════════════════════════════════════
   STEP 1 — Personal Information (rendered as Step 3)
════════════════════════════════════════ */
function Step1({
  form,
  onChange,
  onFileChange,
  onSubmit,
  onPrev,
  isLastStep,
  isSubmitting,
  onOpenBranchModal,
  governorateOptions,
  isSendingOtp,
  isVerifyingOtp,
  onSendCode,
  onVerifyCode,
  onRecaptchaChange,
  recaptchaRef,
  canSubmit,
}) {
  const { t, locale } = useI18n();
  const ci = t.car_installment;
  const isRtl = locale !== "en";

  const employmentOptions = ci.employment_options || [];

  return (
    <Box>
      {/* National ID */}
      <SectionTitle>{ci.national_id_section}</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 1,
        }}
      >
        <UploadBox
          label={ci.id_front}
          hint={ci.file_formats}
          preview={form.idFrontPreview}
          onFileChange={(e) => onFileChange("idFront", e)}
          chooseLabel={ci.choose_image}
          changeLabel={ci.change_image}
        />
        <UploadBox
          label={ci.id_back}
          hint={ci.file_formats}
          preview={form.idBackPreview}
          onFileChange={(e) => onFileChange("idBack", e)}
          chooseLabel={ci.choose_image}
          changeLabel={ci.change_image}
        />
      </Box>

      <Divider sx={S.sectionDivider} />

      {/* Work Data */}
      <SectionTitle>{ci.work_data_section}</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <FieldLabel>{ci.employment_status}</FieldLabel>
          <CISelect
            value={form.employmentStatus}
            onChange={onChange}
            name="employmentStatus"
            placeholder={ci.employment_status}
            options={employmentOptions}
          />
        </Box>
        <Box>
          <FieldLabel>{ci.employer}</FieldLabel>
          <TextField
            value={form.employer}
            onChange={onChange}
            name="employer"
            placeholder={ci.employer}
            size="small"
            sx={S.textField}
            inputProps={{ style: { textAlign: isRtl ? "right" : "left" } }}
          />
        </Box>
        <Box>
          <FieldLabel>{ci.governorate}</FieldLabel>
          <CISelect
            value={form.governorate}
            onChange={onChange}
            name="governorate"
            placeholder={ci.governorate}
            options={governorateOptions}
          />
        </Box>
        <Box>
          <FieldLabel>{ci.district}</FieldLabel>
          <TextField
            value={form.district}
            onChange={onChange}
            name="district"
            placeholder={ci.district}
            size="small"
            sx={S.textField}
            inputProps={{ style: { textAlign: isRtl ? "right" : "left" } }}
          />
        </Box>
      </Box>

      <Divider sx={S.sectionDivider} />

      {/* Branch + Mobile */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Nearest Branch */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <FieldLabel>{ci.nearest_branch}</FieldLabel>
          <Typography sx={S.branchSubtitle}>{ci.branch_subtitle}</Typography>
          {form.selectedBranch ? (
            <Box sx={S.branchCard}>
              <Button size="small" sx={S.changeBtn} onClick={onOpenBranchModal}>
                {ci.change_branch}
              </Button>
              <Box sx={S.branchInfo}>
                <Typography sx={S.branchName}>
                  {form.selectedBranch.title}
                </Typography>
                {form.selectedBranch.address && (
                  <Typography sx={S.branchAddress}>
                    {form.selectedBranch.address}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={S.branchSelectBox} onClick={onOpenBranchModal}>
              <Typography sx={{ color: "#aaa", fontSize: "14px" }}>
                {ci.select_branch}
              </Typography>
              <KeyboardArrowDownIcon sx={{ color: "#aaa", fontSize: 20 }} />
            </Box>
          )}
        </Box>

        {/* Mobile */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <FieldLabel>{ci.mobile_number}</FieldLabel>
          <FieldLabel
            sx={{
              mt: 0.5,
              fontSize: "12px !important",
              color: "#888 !important",
            }}
          >
            {ci.phone_number}
          </FieldLabel>
          <Box sx={S.phoneInputWrapper}>
            <Box
              component="input"
              value={form.phone}
              onChange={onChange}
              name="phone"
              type="tel"
              placeholder="01X XXXX XXXX"
              sx={S.phoneInputInner}
              maxLength={11}
            />
            <Box sx={S.flagBox}>
              <CIcon icon={cifEg} style={{ width: "22px", flexShrink: 0 }} />
              <Typography sx={{ fontSize: "12px", color: "#555" }}>
                ▾
              </Typography>
            </Box>
          </Box>

          {/* Phone verification (OTP) */}
          <Box sx={{ mt: 1 }}>
            {form.otpVerified ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#2e7d32",
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                  {ci.verified}
                </Typography>
              </Box>
            ) : form.otpSent ? (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  value={form.otpCode}
                  onChange={onChange}
                  name="otpCode"
                  placeholder={ci.code_placeholder}
                  size="small"
                  sx={{ ...S.textField, maxWidth: "160px" }}
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: "center", letterSpacing: "2px" },
                  }}
                />
                <Button
                  size="small"
                  onClick={onVerifyCode}
                  disabled={isVerifyingOtp || !form.otpCode}
                  sx={{ ...S.changeBtn, minWidth: "76px" }}
                >
                  {isVerifyingOtp ? ci.otp_verifying : ci.verify_code}
                </Button>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: ORANGE,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={onSendCode}
                >
                  {ci.resend_code}
                </Typography>
              </Box>
            ) : (
              <Button
                size="small"
                onClick={onSendCode}
                disabled={isSendingOtp || !form.phone}
                sx={{ ...S.changeBtn, minWidth: "100px" }}
              >
                {isSendingOtp ? ci.otp_sending : ci.send_code}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Divider sx={S.sectionDivider} />

      {/* Email */}
      <Box sx={{ mb: 2 }}>
        <FieldLabel>{ci.email}</FieldLabel>
        <TextField
          value={form.email}
          onChange={onChange}
          name="email"
          type="email"
          placeholder={ci.email}
          size="small"
          sx={S.textField}
          inputProps={{ style: { textAlign: isRtl ? "right" : "left" } }}
        />
      </Box>

      {/* Consent */}
      <Box
        sx={S.consentRow}
        onClick={() =>
          onChange({ target: { name: "consent", value: !form.consent } })
        }
      >
        <Typography sx={S.consentText}>{ci.credit_inquiry_consent}</Typography>
        <Checkbox
          checked={form.consent}
          sx={{ color: "#ccc", "&.Mui-checked": { color: ORANGE }, p: 0.5 }}
          onChange={() => {}}
        />
      </Box>

      {/* reCAPTCHA */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isRtl ? "flex-end" : "flex-start",
          my: 2,
        }}
      >
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={onRecaptchaChange}
          onExpired={() => onRecaptchaChange(null)}
          hl={locale}
        />
      </Box>

      {/* Buttons */}
      <Box sx={S.buttonRow}>
        <Button sx={S.secondaryBtn} onClick={onPrev} disabled={isSubmitting}>
          {ci.previous}
        </Button>
        <Button
          sx={S.primaryBtn}
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmit}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} sx={{ color: "#fff" }} />
            ) : null
          }
        >
          {isSubmitting
            ? ci.submitting
            : isLastStep
              ? ci.submit_request
              : ci.next}
        </Button>
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════
   STEP 2 — Financing Information
════════════════════════════════════════ */
function Step2({ form, onChange, onNext, onPrev }) {
  const { t, locale } = useI18n();
  const ci = t.car_installment;
  const isRtl = locale !== "en";

  return (
    <Box>
      <SectionTitle>{ci.financing_section}</SectionTitle>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 1,
        }}
      >
        <Box>
          <FieldLabel>{ci.down_payment}</FieldLabel>
          <TextField
            value={form.downPayment}
            onChange={onChange}
            name="downPayment"
            placeholder="0"
            size="small"
            type="number"
            sx={S.textField}
            inputProps={{
              min: 0,
              style: { textAlign: isRtl ? "right" : "left" },
            }}
          />
        </Box>
        <Box>
          <FieldLabel>{ci.car_price}</FieldLabel>
          <TextField
            value={form.carPrice}
            onChange={onChange}
            name="carPrice"
            placeholder="0"
            size="small"
            type="number"
            sx={S.textField}
            inputProps={{
              min: 0,
              style: { textAlign: isRtl ? "right" : "left" },
            }}
          />
        </Box>
      </Box>

      {/* Info note */}
      <Box sx={S.infoNote}>
        <InfoOutlinedIcon
          sx={{ color: ORANGE, fontSize: 18, mt: 0.1, flexShrink: 0 }}
        />
        <Typography sx={S.infoNoteText}>{ci.insurance_note}</Typography>
      </Box>

      <Divider sx={S.sectionDivider} />

      {/* Installment options */}
      <SectionTitle>{ci.choose_installment}</SectionTitle>
      <Box>
        {INSTALLMENT_OPTIONS.map((months) => {
          const selected = form.selectedMonths === months;
          const monthly =
            form.carPrice && form.downPayment
              ? Math.round(
                  (Number(form.carPrice) - Number(form.downPayment)) / months,
                )
              : 3525;

          return (
            <Box
              key={months}
              sx={S.installmentCard(selected)}
              onClick={() =>
                onChange({ target: { name: "selectedMonths", value: months } })
              }
            >
              <Radio
                checked={selected}
                sx={{
                  color: "#ccc",
                  "&.Mui-checked": { color: ORANGE },
                  p: 0.5,
                }}
                onChange={() => {}}
              />
              <Box sx={{ flex: 1, textAlign: isRtl ? "right" : "left" }}>
                <Typography sx={S.installmentMonths}>
                  {months} {ci.months}
                </Typography>
                <Typography sx={S.installmentAmount}>
                  {monthly.toLocaleString("en-US")} {ci.per_month}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Buttons */}
      <Box sx={S.buttonRow}>
        <Button sx={S.secondaryBtn} onClick={onPrev}>
          {ci.previous}
        </Button>
        <Button
          sx={S.primaryBtn}
          onClick={onNext}
          disabled={!form.selectedMonths}
        >
          {ci.next}
        </Button>
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════
   STEP 3 — Car Information (rendered as Step 1)
════════════════════════════════════════ */
function Step3({ form, onChange, onPrev, onSubmit, isFirstStep }) {
  const { t, locale } = useI18n();
  const ci = t.car_installment;
  const isRtl = locale !== "en";

  const carDecided = form.carDecided;
  const carCondition = form.carCondition;

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (carDecided !== true) return;
    api.get("/general/car-brands").then((res) => setBrands(res.data || []));
  }, [carDecided]);

  useEffect(() => {
    if (!form.carBrand) {
      setModels([]);
      return;
    }
    api
      .get("/general/car-models", { brandId: form.carBrand })
      .then((res) => setModels(res.data || []));
  }, [form.carBrand]);

  useEffect(() => {
    if (!form.carModel) {
      setCategories([]);
      return;
    }
    api
      .get("/general/car-categories", { modelId: form.carModel })
      .then((res) => setCategories(res.data || []));
  }, [form.carModel]);

  const localize = (item) => item.name[locale] || item.name.ar;
  const brandOptions = brands.map((b) => ({ value: b.id, label: localize(b) }));
  const modelOptions = models.map((m) => ({ value: m.id, label: localize(m) }));
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: localize(c),
  }));

  const handleBrandChange = (e) => {
    onChange(e);
    onChange({ target: { name: "carModel", value: "" } });
    onChange({ target: { name: "carCategory", value: "" } });
  };

  const handleModelChange = (e) => {
    onChange(e);
    onChange({ target: { name: "carCategory", value: "" } });
  };

  return (
    <Box>
      {/* Car condition */}
      <SectionTitle>{ci.car_condition_section}</SectionTitle>
      <Box sx={S.conditionBtnGroup}>
        <Button
          sx={S.conditionBtn(carCondition === "new")}
          onClick={() =>
            onChange({ target: { name: "carCondition", value: "new" } })
          }
        >
          {ci.new_car}
        </Button>
        <Button
          sx={S.conditionBtn(carCondition === "used")}
          onClick={() =>
            onChange({ target: { name: "carCondition", value: "used" } })
          }
        >
          {ci.used_car}
        </Button>
      </Box>

      <Divider sx={S.sectionDivider} />

      {/* Decided on car? */}
      <SectionTitle>{ci.car_decided_question}</SectionTitle>
      <Box sx={S.carDecisionGrid}>
        <Box
          sx={S.carDecisionCard(carDecided === true)}
          onClick={() =>
            onChange({ target: { name: "carDecided", value: true } })
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CAR_IMG}
            alt={ci.yes_label}
            style={{
              width: "100%",
              maxWidth: 130,
              height: "auto",
              objectFit: "contain",
            }}
          />
          <Typography sx={S.carDecisionLabel}>{ci.yes_label}</Typography>
          <Typography sx={S.carDecisionSub}>
            {ci.know_brand_subtitle}
          </Typography>
        </Box>

        <Box
          sx={S.carDecisionCard(carDecided === false)}
          onClick={() =>
            onChange({ target: { name: "carDecided", value: false } })
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CAR_IMG}
            alt={ci.no_label}
            style={{
              width: "100%",
              maxWidth: 130,
              height: "auto",
              objectFit: "contain",
            }}
          />
          <Typography sx={S.carDecisionLabel}>{ci.no_label}</Typography>
          <Typography sx={S.carDecisionSub}>
            {ci.not_decided_subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Car details (only when decided) */}
      {carDecided === true && (
        <>
          <Divider sx={S.sectionDivider} />
          <SectionTitle>{ci.car_info_section}</SectionTitle>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <FieldLabel>{ci.brand}</FieldLabel>
              <CISelect
                value={form.carBrand}
                onChange={handleBrandChange}
                name="carBrand"
                placeholder={ci.brand}
                options={brandOptions}
              />
            </Box>
            <Box>
              <FieldLabel>{ci.model}</FieldLabel>
              <CISelect
                value={form.carModel}
                onChange={handleModelChange}
                name="carModel"
                placeholder={form.carBrand ? ci.model : ci.select_brand_first}
                options={modelOptions}
                disabled={!form.carBrand}
              />
            </Box>
            <Box>
              <FieldLabel>{ci.manufacturing_year}</FieldLabel>
              <CISelect
                value={form.carYear}
                onChange={onChange}
                name="carYear"
                placeholder={ci.manufacturing_year}
                options={YEAR_OPTIONS}
              />
            </Box>
            <Box>
              <FieldLabel>{ci.category}</FieldLabel>
              <CISelect
                value={form.carCategory}
                onChange={onChange}
                name="carCategory"
                placeholder={
                  form.carModel ? ci.category : ci.select_model_first
                }
                options={categoryOptions}
                disabled={!form.carModel}
              />
            </Box>
          </Box>
        </>
      )}

      {/* Buttons */}
      <Box sx={isFirstStep ? {} : S.buttonRow}>
        {!isFirstStep && (
          <Button sx={S.secondaryBtn} onClick={onPrev}>
            {ci.previous}
          </Button>
        )}
        <Button
          sx={isFirstStep ? { ...S.primaryBtn, width: "100%" } : S.primaryBtn}
          onClick={onSubmit}
          disabled={carDecided === undefined}
        >
          {ci.next}
        </Button>
      </Box>
    </Box>
  );
}

const INITIAL_FORM = {
  // Step 3 (Personal Info)
  idFront: null,
  idFrontPreview: null,
  idBack: null,
  idBackPreview: null,
  employmentStatus: "",
  employer: "",
  governorate: "",
  district: "",
  phone: "",
  email: "",
  otpSent: false,
  otpCode: "",
  otpVerified: false,
  recaptchaToken: null,
  consent: false,
  selectedBranch: null,
  // Step 2 (Financing)
  downPayment: "",
  carPrice: "",
  selectedMonths: null,
  // Step 1 (Car Info)
  carCondition: "",
  carDecided: undefined,
  carBrand: "",
  carModel: "",
  carCategory: "",
  carYear: "",
};

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function CarInstallmentPage() {
  const { t, locale } = useI18n();
  const ci = t.car_installment || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const recaptchaRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "phone" && value !== prev.phone && prev.otpVerified) {
        return {
          ...prev,
          [name]: value,
          otpSent: false,
          otpVerified: false,
          otpCode: "",
        };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const handleFileChange = useCallback((field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [field]: file, [`${field}Preview`]: url }));
  }, []);

  const handleBranchSelect = useCallback((branch) => {
    setForm((prev) => ({ ...prev, selectedBranch: branch }));
  }, []);

  const goNext = useCallback(
    () => setCurrentStep((s) => Math.min(s + 1, 3)),
    [],
  );
  const goPrev = useCallback(
    () => setCurrentStep((s) => Math.max(s - 1, 1)),
    [],
  );

  const toastOpts = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    theme: "colored",
  };

  const handleSendCode = useCallback(async () => {
    if (!form.phone) {
      toast.error(ci.otp_enter_phone_first, toastOpts);
      return;
    }
    setIsSendingOtp(true);
    try {
      await api.post("/auth/send-otp", { phone: "+20" + form.phone });
      setForm((prev) => ({
        ...prev,
        otpSent: true,
        otpVerified: false,
        otpCode: "",
      }));
      toast.success(ci.otp_sent_success, toastOpts);
    } catch {
      toast.error(ci.otp_sent_error, toastOpts);
    } finally {
      setIsSendingOtp(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.phone, ci]);

  const handleVerifyCode = useCallback(async () => {
    setIsVerifyingOtp(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        phone: "+20" + form.phone,
        code: form.otpCode,
      });
      if (res.data?.verified) {
        setForm((prev) => ({ ...prev, otpVerified: true }));
        toast.success(ci.otp_verified_success, toastOpts);
      } else {
        toast.error(ci.otp_invalid, toastOpts);
      }
    } catch {
      toast.error(ci.otp_invalid, toastOpts);
    } finally {
      setIsVerifyingOtp(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.phone, form.otpCode, ci]);

  const handleRecaptchaChange = useCallback((token) => {
    setForm((prev) => ({ ...prev, recaptchaToken: token || null }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.recaptchaToken) {
      toast.error(ci.recaptcha_required, toastOpts);
      return;
    }

    setIsSubmitting(true);
    try {
      const verifyRes = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: form.recaptchaToken }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        toast.error(ci.recaptcha_required, toastOpts);
        recaptchaRef.current?.reset();
        setForm((prev) => ({ ...prev, recaptchaToken: null }));
        return;
      }

      const [idFrontUrl, idBackUrl] = await Promise.all([
        form.idFront ? uploadToS3(form.idFront, "idFront", form.phone) : null,
        form.idBack ? uploadToS3(form.idBack, "idBack", form.phone) : null,
      ]);

      await api.post("/services/request-info", {
        crmId: "auto",
        mobilePhone: "+20" + form.phone,
        email: form.email,
        carCondition: form.carCondition,
        carDecided: form.carDecided,
        carBrand: form.carBrand || null,
        carModel: form.carModel || null,
        carYear: form.carYear || null,
        carCategory: form.carCategory || null,
        downPayment: form.downPayment ? Number(form.downPayment) : null,
        carPrice: form.carPrice ? Number(form.carPrice) : null,
        installmentMonths: form.selectedMonths,
        employmentStatus: form.employmentStatus,
        employer: form.employer,
        governorate: form.governorate,
        district: form.district,
        branchTitle: form.selectedBranch?.title || null,
        branchAddress: form.selectedBranch?.address || null,
        creditInquiryConsent: form.consent,
        idFrontUrl,
        idBackUrl,
      });

      toast.success(ci.submit_success, toastOpts);

      // Reset form after success
      recaptchaRef.current?.reset();
      setCurrentStep(1);
      setForm(INITIAL_FORM);
    } catch {
      toast.error(ci.submit_error, toastOpts);
    } finally {
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, ci]);

  // Build governorate options from locale (all 27 Egyptian governorates)
  const governorateOptions = (t.governorates || []).map((g) => ({
    value: g.governorate_name,
    label: g.governorate_name,
  }));

  const stepLabels = [
    ci.step3_label || "معلومات السيارة",
    ci.step2_label || "معلومات التمويل",
    ci.step1_label || "معلومات شخصية",
  ];

  const canSubmit = form.consent && form.otpVerified && !!form.recaptchaToken;

  return (
    <>
      <PageHead
        title={ci.page_title || "Car Installment"}
        description="Apply for car installment financing with Contact Financial Holding"
      />

      <BranchModal
        open={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        onSelect={handleBranchSelect}
      />

      <Box sx={S.pageWrapper}>
        {/* Form */}
        <Box sx={S.formWrapper}>
          <Box sx={S.formCard}>
            <InstallmentStepper currentStep={currentStep} labels={stepLabels} />

            {/* Step 1: Car Information */}
            {currentStep === 1 && (
              <Step3
                form={form}
                onChange={handleChange}
                onPrev={null}
                onSubmit={goNext}
                isFirstStep
              />
            )}

            {/* Step 2: Financing Information */}
            {currentStep === 2 && (
              <Step2
                form={form}
                onChange={handleChange}
                onNext={goNext}
                onPrev={goPrev}
              />
            )}

            {/* Step 3: Personal Information */}
            {currentStep === 3 && (
              <Step1
                form={form}
                onChange={handleChange}
                onFileChange={handleFileChange}
                onSubmit={handleSubmit}
                onPrev={goPrev}
                isLastStep
                isSubmitting={isSubmitting}
                onOpenBranchModal={() => setBranchModalOpen(true)}
                governorateOptions={governorateOptions}
                isSendingOtp={isSendingOtp}
                isVerifyingOtp={isVerifyingOtp}
                onSendCode={handleSendCode}
                onVerifyCode={handleVerifyCode}
                onRecaptchaChange={handleRecaptchaChange}
                recaptchaRef={recaptchaRef}
                canSubmit={canSubmit}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
