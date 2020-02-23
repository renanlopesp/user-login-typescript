import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { User } from '../../models/User'

@ValidatorConstraint({ async: true })
export class isEmailAlreadyExistConstraint
    implements ValidatorConstraintInterface {
    validate(email: string) {
        return User.findOne({ where: { email } }).then(user => {
            if (user) return false
            return true
        })
    }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: isEmailAlreadyExistConstraint,
        })
    }
}
