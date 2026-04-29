import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Patient, Department } from '@/shared/types'
import { Modal } from '@/shared/components/ui/Modal'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { Button } from '@/shared/components/ui/Button'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  age: z.coerce.number().min(0).max(130),
  gender: z.enum(['Male', 'Female', 'Other']),
  condition: z.string().min(2, 'Condition required'),
  status: z.enum(['Stable', 'Critical', 'Recovering', 'Discharged']),
  doctor: z.string().min(2, 'Doctor required'),
  department: z.string().min(1),
  phone: z.string().min(7, 'Phone required'),
  email: z.string().email('Valid email required'),
  bloodType: z.string().min(1),
})

type FormData = z.infer<typeof schema>

interface AddPatientModalProps {
  open: boolean
  onClose: () => void
  onAdd: (p: Patient) => void
}

const departments: Department[] = [
  'Cardiology', 'Neurology', 'Oncology', 'Orthopedics',
  'Pediatrics', 'Emergency', 'General Medicine', 'Radiology',
]

export function AddPatientModal({ open, onClose, onAdd }: AddPatientModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'Male', status: 'Stable', department: 'General Medicine', bloodType: 'O+' },
  })

  function onSubmit(data: FormData) {
    const patient: Patient = {
      id: `p${Date.now()}`,
      ...data,
      department: data.department as Department,
      lastVisit: new Date().toISOString().split('T')[0],
      nextAppointment: null,
      admittedDate: new Date().toISOString().split('T')[0],
      insuranceId: `INS-${new Date().getFullYear()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
    }
    onAdd(patient)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Patient" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} className="col-span-2" />
          <Input label="Age" type="number" placeholder="42" error={errors.age?.message} {...register('age')} />
          <Select
            label="Gender"
            options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]}
            {...register('gender')}
          />
          <Input label="Condition" placeholder="Hypertension" error={errors.condition?.message} {...register('condition')} className="col-span-2" />
          <Select
            label="Status"
            options={[
              { value: 'Stable', label: 'Stable' },
              { value: 'Critical', label: 'Critical' },
              { value: 'Recovering', label: 'Recovering' },
              { value: 'Discharged', label: 'Discharged' },
            ]}
            {...register('status')}
          />
          <Select
            label="Department"
            options={departments.map((d) => ({ value: d, label: d }))}
            {...register('department')}
          />
          <Input label="Doctor" placeholder="Dr. Smith" error={errors.doctor?.message} {...register('doctor')} className="col-span-2" />
          <Input label="Phone" placeholder="+1 (555) 000-0000" error={errors.phone?.message} {...register('phone')} />
          <Select
            label="Blood Type"
            options={['A+','A-','B+','B-','O+','O-','AB+','AB-'].map((bt) => ({ value: bt, label: bt }))}
            {...register('bloodType')}
          />
          <Input label="Email" type="email" placeholder="patient@email.com" error={errors.email?.message} {...register('email')} className="col-span-2" />
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={() => { reset(); onClose() }}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add Patient
          </Button>
        </div>
      </form>
    </Modal>
  )
}
