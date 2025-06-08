import React, { useState, useEffect } from "react";
import { Grid, TextField, Typography, IconButton } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

const CertificateUpload = ({ control, errors, setValue }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { watch } = useFormContext();
  const certificationsValue = watch("certifications");

  // Sync selectedFiles với form value
  useEffect(() => {
    if (certificationsValue && Array.isArray(certificationsValue)) {
      setSelectedFiles(certificationsValue);
    }
  }, [certificationsValue]);

  const handleFilesChange = (e, onChange) => {
    const files = Array.from(e.target.files);
    const mergedFiles = [...selectedFiles, ...files];
    setSelectedFiles(mergedFiles);
    // Gọi onChange của Controller để cập nhật form state
    onChange(mergedFiles);
    // Cũng sử dụng setValue để đảm bảo validation được trigger
    setValue("certifications", mergedFiles, { shouldValidate: true });
  };

  const handleRemoveFile = (indexToRemove, onChange) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    // Cập nhật form state
    onChange(updatedFiles);
    setValue("certifications", updatedFiles, { shouldValidate: true });
  };

  return (
    <Grid container spacing={4} mt={2}>
      <Grid   flex={1}>
        <h4 className="text-lg font-bold mb-2">
          Files Cert <span className="text-gray-500">(.pdf, .doc, .docx, .png, .jpg, .jpeg)</span> <span className="text-red-500">*</span>
        </h4>

        <Controller
          name="certifications"
          control={control}
          render={({ field: { onChange } }) => (
            <TextField
              fullWidth
              type="file"
              inputProps={{ 
                multiple: true, 
                accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
                key: selectedFiles.length // Force re-render để reset file input
              }}
              variant="outlined"
              error={!!errors.certifications}
              helperText={errors.certifications?.message}
              onChange={(e) => handleFilesChange(e, onChange)}
            />
          )}
        />

        
        <div className="mt-4 space-y-4 grid grid-cols-2 gap-4">
          {selectedFiles.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const isPdf = file.type === "application/pdf";
            const isDoc =
              file.type === "application/msword" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            const fileUrl = URL.createObjectURL(file);

            return (
              <div key={index} className="shadow flex items-start gap-2">
                <div className="flex-1 relative max-h-50">
                  {isImage && (
                    <img
                      src={fileUrl}
                      alt={`preview-${index}`}
                      className="max-h-50 rounded w-full object-cover"
                    />
                  )}
                  {isPdf && (
                    <div className="flex flex-col items-center justify-center h-50 bg-gray-100 rounded">
                      <p className="text-red-600 font-semibold text-6xl ">PDF</p>
                      <p className="text-gray-800 text-sm">{file.name}</p>
                    </div>
                  )}
                  {isDoc && (
                    <div className="flex items-center justify-center h-50 bg-gray-100 rounded">
                      <p className="text-blue-600 font-semibold text-3xl">DOC</p>
                      <p className="text-gray-800 text-sm">{file.name}</p>
                    </div>
                  )}
                  {!isImage && !isPdf && !isDoc && (
                    <p className="text-gray-600">{file.name} (Unsupported)</p>
                  )}
                  
                  <Controller
                    name="certifications"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(index, onChange)}
                        className="!absolute right-1 top-0 z-10"
                        aria-label="Remove file"
                        sx={{
                          backgroundColor: "#eeeeee",
                          borderRadius: "50%",
                          boxShadow: 1,
                          "&:hover": {
                            backgroundColor: "#f5f5f5", 
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" color="error" />
                      </IconButton>
                    )}
                  />

                </div>
              </div>
            );
          })}
        </div>
      </Grid>
    </Grid>
  );
};

export default CertificateUpload;
