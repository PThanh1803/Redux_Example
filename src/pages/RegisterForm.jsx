import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { ArrowBack, ArrowForward, CheckCircle } from "@mui/icons-material";
import RoleSelection from "../components/RoleSelection";
import PersonalInfo from "../components/PersonalInfo";
import ContentSharing from "../components/ContentSharing";
import {
  step1Schema,
  step2Schema,
  step3Schema,
} from "../validation/validationSchemas";

const steps = [
  { label: "Chọn vai trò", component: RoleSelection },
  { label: "Thông tin cá nhân", component: PersonalInfo },
  { label: "Nội dung chia sẻ", component: ContentSharing },
];

const validationSchemas = [step1Schema, step2Schema, step3Schema];
const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set([1]));

  const methods = useForm({
    resolver: yupResolver(validationSchemas[currentStep - 1]),
    defaultValues: {
      role: "educator",
      role1: "",
      fullName: "",
      email: "phambathanh1803@gmail.com",
      phoneNumber: "",
      greeting: "anh",
      linkedinUrl: "",
      socialMediaUrl: "",
      menteeLevel: [],
      sharingContent: [],
      yearOfExperience: 0,
      areaOfExpertise: "",
      certifications: [],
      educationBackground: "",
    },

    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  console.log("completedSteps:", completedSteps);

  const handleNext = handleSubmit(async (data) => {
    try {
      if (currentStep < steps.length) {
        if (currentStep + 1 > 1) {
          setCompletedSteps((prev) => new Set([...prev, currentStep]));
        }
        setCurrentStep(currentStep + 1);
      } else {
        if (data.role === "mentor") {
          delete data.yearOfExperience;
          delete data.areaOfExpertise;
          delete data.certifications;
          delete data.educationBackground;
        }
        console.log("Form submitted:", data);
        alert(
          "Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm. " +
            data.email +
            " " +
            data.phoneNumber +
            " " +
            data.fullName +
            " " +
            data.role +
            " " +
            data.greeting +
            " " +
            data.linkedinUrl +
            " " +
            data.socialMediaUrl +
            " " +
            data.menteeLevel.join(", ") +
            " " +
            data.sharingContent.join(", ") +
            " " +
            data.yearOfExperience +
            " " +
            data.areaOfExpertise +
            " " +
            data.certifications +
            " " +
            data.educationBackground
        );
        setCompletedSteps(new Set());
        setCurrentStep(1);
        reset();
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  });

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step) => {
    if ((step> currentStep +2 ) ||step > currentStep && !isValid) {
      alert(
        "Vui lòng hoàn thành bước trước đó trước khi chuyển sang bước này."
      );
      return;
    }
    setCurrentStep(step);
  };

  useEffect(() => {
    methods.reset(methods.getValues());
  }, [currentStep, methods]);

  const StepComponent = steps[currentStep - 1].component;

  return (
    <Container maxWidth="md" className="py-8">
      <Paper elevation={0} className="p-8">
        <Typography
          variant="h4"
          align="center"
          className="mb-8 font-bold text-gray-800"
          mb={4}
          >
          Trở thành chuyên gia của Edtronaut
        </Typography>

        <Tabs
          value={currentStep - 1}        
          className="bg-white rounded-lg"
          sx={{
            "& .MuiTabs-indicator": {
              display: "none", 
            },
          }}
        >
          {steps.map((step, index) => (
            <Tab
              key={index}
              sx={{
                "&.MuiTab-root": {
                  flex: 1,
                  minWidth: "32.5%", 
                  padding: "8px 16px",
                  alignItems: "flex-start",
                  position: "relative",
                  backgroundColor: index + 1 <= currentStep ? "#c7effc" : "#e5e7eb",
                  borderRadius: "8px",
                  margin: "4px",
                  "&:hover": {
                    backgroundColor: index + 1 <= currentStep ? "#c7effc" : "#d1d5db",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "0",
                    right: "0",
                    height: "4px",
                    backgroundColor: index + 1 <= currentStep ? "#1e40af" : "#9ca3af",
                    borderRadius: "2px",
                    transition: "background-color 0.3s ease",
                  },
                },
              }}
              value={index}
              label={
                <Box className="align-left text-left py-2 ">
                  <Box className="flex items-center gap-2 mb-1">
                  <Typography
                    variant="body1"
                    className={` transition-colors ${
                      index + 1 <= currentStep
                        ? "text-blue-600"
                        : "text-gray-600"
                    } `}
                    fontWeight="bold"
                  >
                    Bước {index + 1}
                  </Typography>
                  <CheckCircle
                    className={`${
                      completedSteps.has(index + 1)
                        ? "text-green-600"
                        : "invisible"
                    }`}
                  />
                  </Box>
                  <Typography 
                    variant="body2" 
                    className={index + 1 <= currentStep ? "text-black" : "text-gray-500"}
                  >
                    {step.label}
                  </Typography>
                </Box>
              }
              onClick={() => handleStepClick(index + 1)}
              className="normal-case px-4 min-w-[120px] rounded-lg transition-colors"
              disabled={Math.abs((index + 1) - currentStep) > 1 || index+1 > currentStep && !isValid}
            />
          ))} 
        </Tabs>

        <FormProvider {...methods}>
          <form onSubmit={handleNext}>
            <Box className="min-h-96 my-8">
              <StepComponent />
            </Box>

            <Box className="flex justify-between items-center">
              <Box className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    startIcon={<ArrowBack />}
                    className="px-6 py-2"
                  >
                    Trở về
                  </Button>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={!isValid}
                endIcon={<ArrowForward />}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === steps.length ? "Đăng ký" : "Tiếp tục"}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
