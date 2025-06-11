import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  InputAdornment
} from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { GREETING_OPTIONS } from '../constants/formConfig';

const PersonalInfo = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Box className="w-full max-w-4xl mx-auto gap-4 py-4 flex flex-col ">
      <Grid container spacing={4} justifyContent="space-between">
        <Grid  flex={1} >
          <h4 className="text-lg font-bold mb-2">Họ và tên <span className="text-red-500">*</span></h4>
          <Controller
            name="fullName"
            control={control}  
            render={({ field }) => (
              <TextField
                {...field}
               
                placeholder="Họ và tên *"
                fullWidth
                variant="outlined"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                className="mb-4"
                 
              />
            )}
          />
        </Grid>

        <Grid  flex={1}>
          <h4 className="text-lg font-bold mb-2">Cách xưng hô phù hợp với bạn? <span className="text-red-500">*</span></h4>
          <Controller
            name="greeting"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.greeting}>
                <Select
                  {...field}
                >
                  {GREETING_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.greeting && (
                  <FormHelperText>{errors.greeting.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={4} justifyContent="space-between">
        <Grid flex={1}>
          <h4 className="text-lg font-bold mb-2">Email <span className="text-red-500">*</span></h4>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Email *"
                type="email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                className="mb-4"
              />
            )}
          />
        </Grid>

        <Grid  flex={1}>
          <h4 className="text-lg font-bold mb-2">Số điện thoại <span className="text-red-500">*</span></h4>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Số điện thoại *"
                variant="outlined"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                className="mb-4"
              />
            )}
          />
        </Grid>
      </Grid>
      
        <Grid width="100%" marginY="10px">
          <h4 className="text-lg font-bold mb-2">LinkedIn của anh/chị <span className="text-red-500">*</span></h4>
          <Controller
            name="linkedinUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="LinkedIn của anh/chị *"
                variant="outlined"
                error={!!errors.linkedinUrl}
                helperText={errors.linkedinUrl?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => field.value && window.open(field.value, '_blank')}
                        disabled={!field.value}
                        size="small"
                      >
                        <OpenInNew fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                className="mb-4"
              />
            )}
          />
        </Grid>

        <Grid width="100%" >
          <h4 className="text-lg font-bold mb-2">Social media mà anh/chị thường sử dụng (facebook, instagram, twitter,...) <span className="text-red-500">*</span></h4>
          <Controller
            name="socialMediaUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Social media mà anh/chị thường sử dụng (facebook, instagram, twitter,...) *"
                variant="outlined"
                error={!!errors.socialMediaUrl}
                helperText={errors.socialMediaUrl?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => field.value && window.open(field.value, '_blank')}
                        disabled={!field.value}
                        size="small"
                      >
                        <OpenInNew fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                className="mb-4"
              />
            )}
          />
        </Grid>
    </Box>
  );
};

export default PersonalInfo; 