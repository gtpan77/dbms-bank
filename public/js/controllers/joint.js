$(document).ready(function(){
  $('select').formSelect();

  const d = new Date();
  d.setFullYear(d.getFullYear() - 13, d.getMonth());

  $('.datepicker').datepicker({
    defaultDate: d,
    maxDate: d,
    yearRange: 100
  });

  $('#reenter_password, #password, #reenter_password1, #password1').on('input', function(){
    if($('#password').val()!=$('#reenter_password').val()){
      $('#password_match').text('Not Match');
    }else {
      $('#password_match').text('');
    }
    if($('#password1').val()!=$('#reenter_password1').val()){
      $('#password_match1').text('Not Match');
    }else {
      $('#password_match1').text('');
    }
  });

  $('#signup-form').on('submit', function(event){
    event.preventDefault();
    console.log(event);
    const data = {};
    $('#signup-form input, #signup-form select').each(function(index){
      const input = $(this);
      // alert('Type: ' + input.attr('type') + ' Name: ' + input.attr('name') + ' Value: ' + input.val());
      if(input.attr('name')){
        data[input.attr('name')] = input.val();
      }
    });
    console.log(data);

    if($('#password').val()!=$('#reenter_password').val()){
      return;
    }

    if($('#password1').val()!=$('#reenter_password1').val()){
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/api/account/newjoint',
      data: data,
      dataType: 'json',
      success: function(res){
        console.log(res);
        if (res.redirect) {
            // data.redirect contains the string URL to redirect to
            window.location.href = res.redirect;
        } 
      }
    });

  });
});