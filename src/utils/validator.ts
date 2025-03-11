import { useNotification } from '@/components/UI_shared/Notification';
import { FormRule } from 'antd';

// Validator
interface keyValidator {
  required?: any;
  email?: any;
  phone?: any;
  number?: any;
  username?: any;
  password?: any;
  people_name?: any;
  full_name?: any;
  department_name?: any;
  required_max50?:any;
  no_space?:any;
}

export const RULES_FORM: Record<keyof keyValidator, FormRule[]> = {
  required: [
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    },
   
  ],
  email: [
    {
      required: true,
      pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      message: 'Email không đúng định dạng',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    },
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      max: 50,
      message: 'Tối đa 50 ký tự',
    },
  ],
  phone: [
    {
      min: 9,
      max: 11,
      pattern: /^0\d{8,10}$/,
      message: 'Số điện thoại phải có từ 9 đến 11 chữ số và bắt đầu bằng 0',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    },
    {
      required: true,
      message: 'Không được để trống',
    },
  ],
  number: [
    {
      required: true,
      pattern: /^[0-9]*$/gm,
      message: 'Chỉ được là số',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    }
  ],
  username: [
    {
      required: true,
      pattern: /^[a-zA-Z0-9]{6,10}$/g,
      message:
        'Tài khoản có độ dài 6-10 chữ/số và không chứa khoảng cách và ký tự đặc biệt',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    }
  ],
  password: [
    {
      required: true,
      pattern:
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\]:;<>,.?~\\-]).{8,}$/g,
      message:
        'Mật khẩu phải có ít nhất 8 kí tự bao gồm chữ hoa, chữ thường, và ít nhất một kí tự đặc biệt và số',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    }
  ],
  people_name: [
    {
      required: true,
      pattern:
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/gm,
      message:
        'Tên nguời dùng phải bắt đầu bằng chữ in hoa, Không bắt đầu và kết thúc bằng dấu cách, không chứa sô và ký tự đặc biệt',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    },
    {
      max: 50,
      message: 'Tối đa 50 ký tự',
    },
  ],
  full_name: [
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      pattern: /^[a-zA-Z ]+$/gm,
      message: 'Tên nguời dùng không chứa ký tự số, không chứa ký tự đặc biệt',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    }
  ],
  department_name: [
    {
      required: true,
      pattern:
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/gm,
      message:
        'Tên phải bắt đầu bằng chữ in hoa, Không bắt đầu và kết thúc bằng dấu cách, không chứa sô và ký tự đặc biệt',
    },
    {
      max: 50,
      message: 'Tối đa 50 ký tự',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    }
  ],
  required_max50: [
    {
      required: true,
      message: 'Không được để trống',

    },
    {
      min: 1,
      message: 'Tên phải tối thiểu 1 ký tự',
    },
    {
      max: 50,
      message: 'Tối đa 50 ký tự',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm
    }
  ],
  no_space:[{
    message: 'Không được bỏ trống',
    pattern: /^(?!\s+$).*/gm
  }]
};

export const validateDates = (
  startDate: string,
  endDate?: string | null,
  show?: (msg: any) => void,
): boolean => {
  if (endDate && endDate < startDate) {
    show?.({
      result: 1,
      messageError: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
    });
    return false;
  }
  return true;
};
