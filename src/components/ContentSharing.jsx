import React from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import useAutocomplete from "@mui/material/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import {
  MENTEE_LEVEL_OPTIONS,
  CONTENT_SHARING_OPTIONS,
  AREA_OF_EXPERTISE_OPTIONS,
  EDUCATION_BACKGROUND_OPTIONS,
} from "../constants/formConfig";
import CertificateUpload from "./CertificateUpload";

const AutocompleteRoot = styled("div")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "14px",
  width: "100%",
}));

const InputWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: "10px",
  display: "flex",
  flexWrap: "wrap",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
  "&.focused": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
  },
  "&.error": {
    borderColor: theme.palette.error.main,
    "&:hover": {
      borderColor: theme.palette.error.main,
    },
    "&.focused": {
      borderColor: theme.palette.error.main,
      boxShadow: `0 0 0 2px ${theme.palette.error.main}20`,
    },
  },
  "& input": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    height: "32px",
    boxSizing: "border-box",
    padding: "8px 12px",
    width: "0",
    minWidth: "120px",
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
    fontSize: "14px",
    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
}));

const StyledTag = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "32px",
  margin: "2px",
  lineHeight: "30px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  boxSizing: "content-box",
  padding: "0 8px 0 12px",
  outline: 0,
  overflow: "hidden",
  fontSize: "14px",
  fontWeight: 500,
  "&:focus": {
    backgroundColor: theme.palette.primary.dark,
  },
  "& span": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  },
  "& svg": {
    fontSize: "18px",
    cursor: "pointer",
    padding: "2px",
    marginLeft: "4px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: "100%",
  margin: "8px 0 0",
  padding: 0,
  position: "absolute",
  top: "100%",
  listStyle: "none",
  backgroundColor: theme.palette.background.paper,
  overflow: "auto",
  maxHeight: "200px",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[8],
  zIndex: theme.zIndex.modal,
  border: `1px solid ${theme.palette.divider}`,
  "& li": {
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "14px",
    "& span": {
      flexGrow: 1,
    },
    "& svg": {
      color: "transparent",
      fontSize: "18px",
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: theme.palette.action.selected,
    fontWeight: 600,
    "& svg": {
      color: theme.palette.primary.main,
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: theme.palette.action.hover,
    "& svg": {
      color: theme.palette.text.secondary,
    },
  },
}));

const Tag = ({ label, onDelete, ...other }) => (
  <StyledTag {...other}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </StyledTag>
);

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const CustomAutocomplete = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  error,
  helperText,
}) => {
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    options: options,
    value: value || [],
    onChange: (event, newValue) => onChange(newValue),
    getOptionLabel: (option) => {
      if (typeof option === 'string') return option;
      if (option && typeof option === 'object' && option.label) return option.label;
      return String(option || '');
    },
  });

  return (
    <AutocompleteRoot>
      <FormControl fullWidth error={error}>
        <h4 className="text-lg font-bold mb-2">{label} <span style={{ color: "red" }}>*</span></h4>
        <div {...getRootProps()}>
          <InputWrapper
            ref={setAnchorEl}
            className={`${focused ? "focused" : ""} ${error ? "error" : ""}`}
          >
            {value?.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return <Tag key={key} {...tagProps} label={option} />;
            })}
            <input
              {...getInputProps()}
              placeholder={value?.length === 0 ? placeholder : ""}
            />
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 && (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => {
              const { key, ...optionProps } = getOptionProps({ option, index });
              return (
                <li key={key} {...optionProps}>
                  <span>{option}</span>
                  <CheckIcon />
                </li>
              );
            })}
          </Listbox>
        )}
        {error && helperText && (
          <FormHelperText sx={{ mt: 1, mx: 0 }}>{helperText}</FormHelperText>
        )}
      </FormControl>
    </AutocompleteRoot>
  );
};

CustomAutocomplete.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

const ContentSharing = () => {
  const theme = useTheme();
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const menteeLevel = watch("menteeLevel") || [];
  const sharingContent = watch("sharingContent") || [];
  const yearOfExperience = watch("yearOfExperience") || "";
  const areaOfExpertise = watch("areaOfExpertise") || null;
  const educationBackground = watch("educationBackground") || null;
  const isEducator = watch("role") === "educator";

  const handleMenteeLevelChange = (newValue) => {
    setValue("menteeLevel", newValue, { shouldValidate: true });
  };

  const handleSharingContentChange = (newValue) => {
    setValue("sharingContent", newValue, { shouldValidate: true });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: theme.breakpoints.values.lg,
        mx: "auto",
        py: 4,
      }}
    >
      <Grid container spacing={4}>
        <Grid flex={1}>
          <Controller
            name="menteeLevel"
            control={control}
            render={() => (
              <CustomAutocomplete
                options={MENTEE_LEVEL_OPTIONS}
                value={menteeLevel}
                onChange={handleMenteeLevelChange}
                label="Đối tượng mentee của bạn "
                placeholder="Chọn đối tượng mentee..."
                error={!!errors.menteeLevel}
                helperText={errors.menteeLevel?.message}
              />
            )}
          />
        </Grid>

        <Grid  flex={1}>
          <Controller
            name="sharingContent"
            control={control}
            render={() => (
              <CustomAutocomplete
                options={CONTENT_SHARING_OPTIONS}
                value={sharingContent}
                onChange={handleSharingContentChange}
                label="Nội dung chia sẻ "
                placeholder="Chọn nội dung chia sẻ..."
                error={!!errors.sharingContent}
                helperText={errors.sharingContent?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      {isEducator && (
        <Box>
          <Grid container spacing={4} mt={2}>
            <Grid flex={1}>
              <h4 className="text-lg font-bold mb-2">
                Số năm kinh nghiệm <span className="text-red-500">*</span>
              </h4>
              <Controller
                name="yearOfExperience"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={yearOfExperience}
                    onChange={(e) => {
                      field.onChange(e);
                      setValue("yearOfExperience", e.target.value, { shouldValidate: true });
                    }}
                    fullWidth
                    placeholder="Số năm kinh nghiệm *"
                    variant="outlined"
                    error={!!errors.yearOfExperience}
                    helperText={errors.yearOfExperience?.message}
                    className="mb-4"
                    type="number"
                    slotProps={{
                      htmlInput: { min: 0 }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid  flex={1}>
              <h4 className="text-lg font-bold mb-2">
                Lĩnh vực chuyên môn <span className="text-red-500">*</span>
              </h4>
              <Controller
                name="areaOfExpertise"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="areaOfExpertise"
                    options={AREA_OF_EXPERTISE_OPTIONS}
                    sx={{ width: "100%" }}
                    value={areaOfExpertise}
                    onChange={(event, newValue) => {
                      field.onChange(newValue);
                      setValue("areaOfExpertise", newValue, { shouldValidate: true });
                    }}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      if (option && typeof option === 'object' && option.label) return option.label;
                      return String(option || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Lĩnh vực chuyên môn *"
                        error={!!errors.areaOfExpertise}
                        helperText={errors.areaOfExpertise?.message}
                        variant="outlined"
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4} mt={2}>
            <Grid flex={1}>
              <h4 className="text-lg font-bold mb-2">
                Học vấn <span className="text-red-500">*</span>
              </h4>
              <Controller
                name="educationBackground"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="educationBackground"
                    options={EDUCATION_BACKGROUND_OPTIONS}
                    sx={{ width: "100%" }}
                    value={educationBackground}
                    onChange={(event, newValue) => {
                      field.onChange(newValue);
                      setValue("educationBackground", newValue, { shouldValidate: true });
                    }}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      if (option && typeof option === 'object' && option.label) return option.label;
                      return String(option || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Học vấn *"
                        error={!!errors.educationBackground}
                        helperText={errors.educationBackground?.message}
                        variant="outlined"
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>

          <CertificateUpload control={control} errors={errors} setValue={setValue} />
        </Box>
      )}
    </Box>
  );
};

export default ContentSharing;
