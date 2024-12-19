namespace VendorResponseSystem.EmailNotification
{
    public class EmailObject
    {
        public List<string> MailTo { get; set; }
        public List<string> MailCC { get; set; }
        public string Subject { get; set; }
        public string body { get; set; }
        public bool IsBodyHTML { get; set; }

        public EmailObject()
        {
            IsBodyHTML = true;
            MailCC = new List<string>();
            MailTo = new List<string>();
        }
    }
}
