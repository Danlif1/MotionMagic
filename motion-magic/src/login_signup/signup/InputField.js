import Form from "react-bootstrap/Form";


function InputField({label,name,id,errors,type,placeholder, checker,aria, ariatext, addValid=false}) {
    if(name==='username') {
        return (
            <Form.Group className="mb-3">
                <Form.Label htmlFor="InputPassword1">{label}</Form.Label>
                <Form.Group className="input-group">
                    <div className="input-group-text">@</div>
                    <Form.Control
                        type={type}
                        id={id}
                        placeholder={placeholder}
                        name={name}
                        onChange={checker}
                        aria-describedby={aria}
                        isInvalid={errors[name].invalid === 1}
                        isValid={errors[name].invalid === 0 && addValid}
                    />
                    <Form.Control.Feedback type="invalid">{errors[name].message}</Form.Control.Feedback>
                    {(aria!=='') &&
                        (<div id={aria} className='form-text text-muted'>
                            {ariatext}
                        </div>)}
                </Form.Group>
            </Form.Group>
        );

    }
    return (
        <Form.Group className="mb-3">
            <Form.Label htmlFor="InputPassword1">{label}</Form.Label>
            <Form.Control
                type={type}
                id={id}
                placeholder={placeholder}
                name={name}
                onChange={checker}
                aria-describedby={aria}
                isInvalid={errors[name].invalid === 1}
                isValid={errors[name].invalid === 0 && addValid}
            />
            <Form.Control.Feedback type="invalid">{errors[name].message}</Form.Control.Feedback>
            {(aria!=='') &&
                (<div id={aria} className='form-text text-muted'>
                    {ariatext}
                </div>)}
        </Form.Group>
    );
}

export default InputField;