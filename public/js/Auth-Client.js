$(document).ready(function(){

    $('.form').find('input, textarea').on('keyup blur focus', function (e) {

        var $this = $(this),
            label = $this.prev('label');

        if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.addClass('active highlight');
            }
        } else if (e.type === 'blur') {
            if( $this.val() === '' ) {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'focus') {

            if( $this.val() === '' ) {
                label.removeClass('highlight');
            }
            else if( $this.val() !== '' ) {
                label.addClass('highlight');
            }
        }
    });

    $('.tab a').on('click', function (e) {

        e.preventDefault();

        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');

        target = $(this).attr('href');

        $('.tab-content > div').not(target).hide();

        $(target).fadeIn(600);

    });

    $('.create-new-user').click(function(){
        $this = $(this);
        var parent = $this.parents('#signup');
        var inputs = parent.find('input');
        var firstName = $(inputs[0]).val();
        var lastName = $(inputs[1]).val();
        var userEmail = $(inputs[2]).val();
        var password = $(inputs[3]).val();
        var user = {
            'first name': firstName,
            'last name': lastName,
            'email address': userEmail,
            'password': password
        };
        console.log(user);
        $.post(
            ("http://localhost:8042/createNewUser"),
            user,
            function(data) {
                console.log("Successful user creation");
                console.log(data);
                loggedInAccess = true;
            },
            "json"
        );
    });

    $('.log-in-existing-user').click(function(){
        $this = $(this);
        var parent = $this.parents('#login');
        var inputs = parent.find('input');
        var userEmail = $(inputs[0]).val();
        var password = $(inputs[1]).val();
        var user = {
            'email address': userEmail,
            'password': password
        };
        console.log(user);
        $.post(
            ("http://localhost:8042/api/logIn"),
            user,
            function(data) {
                console.log("Successful login");
                console.log(data);
                loggedInAccess = true;
            },
            "json"
        );
    });
});


var loggedInAccess = false;


