import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  FormControl,
  Radio,
  Card,
  FormHelperText,
  CardActionArea ,
  CardMedia
} from "@mui/material";
import { ROLE_OPTIONS } from "../constants/formConfig";

const RoleSelection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); 

  const rolesWithIcons = ROLE_OPTIONS.map((role) => ({
    ...role,
    image: role.value === "mentor"
      ? "https://www.thebalancemoney.com/thmb/A_uhaT0yyVle46Bfki8domRJ9Mo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/colleagues-business-woman-working-978531556-b538d8fc0ddc492db50b9189235b2bc8.jpg"
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaA33B0tE6qkybjud-4Ke5H4DmKUcQAUxHGEQoFkda4sgYOn07T53D37yxhIkQQ0IwjuU&usqp=CAU",
     
  }));

  return (
    <Box className="w-full">
      <Typography
        variant="h5"
        align="center"
        className="mb-8 font-semibold text-gray-800"
      >
        Chọn vai trò bạn muốn đăng ký
      </Typography>

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset" className="w-full" error={!!errors.role} sx={{ mt: 4  , display: 'flex', flexDirection: 'row', alignItems: 'center' , gap: 6 }}>
            {rolesWithIcons.length > 0 &&
              rolesWithIcons.map((role) => (
                <Card
                  key={role.value}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderColor:
                      field.value === role.value ? "primary.main" : "grey.300",
                    borderWidth: 2,
                    boxShadow: field.value === role.value ? 4 : 1,
                    borderRadius: 3,
                  }}
                >
                  <CardActionArea
                    onClick={() => field.onChange(role.value)}
                  >
                    <Box display="flex" alignItems="center" p={1}>
                      <Radio
                        checked={field.value === role.value}
                        value={role.value}
                        color="primary"
                        sx={{ pl: 1 }}
                      />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {role.label}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" p={3} height={350}>
                      <CardMedia
                        component="img"
                        width="100%"
                        sx={{ objectFit: "cover", borderRadius: 2 }}
                        image={role.image}
                        alt={role.label}
                      />
                    </Box>
                  
                  </CardActionArea>
                </Card>
              ))}
            {errors.role && (
              <FormHelperText error className="text-center mt-4">
                {errors.role.message}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Box>
  );
};

export default RoleSelection;
